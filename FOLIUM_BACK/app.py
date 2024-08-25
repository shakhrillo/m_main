import os
from flask import Flask, json, jsonify, render_template_string, request
import folium
import googlemaps
from geopy.distance import geodesic
from shapely.geometry import Point
import shapely.geometry as sg
from shapely.geometry import box
import geopandas as gpd
from shapely.geometry import Polygon

from map.main import initMap
from map.render import renderMap
from map.directions import directionsMap
from map.points import addMapPoints, addMapCrossPoint, addMapDot

app = Flask(__name__)

google_key = "AIzaSyDcg4wNobPbPekVNhhyCRRVX37MPlxVQzI"
gmaps = googlemaps.Client(key=google_key)

# Enable CORS for all domains on all routes
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    return response

# world = gpd.read_file('data/110m_cultural/ne_110m_admin_0_countries.shp')

# import findland json
finland = gpd.read_file("data/border/finland.geojson")
estonia = gpd.read_file("data/border/estonia.geojson")
latvia = gpd.read_file("data/border/latvia.geojson")
lithuania = gpd.read_file("data/border/lithuania.geojson")
belarus = gpd.read_file("data/border/belarus.geojson")
world = gpd.read_file("data/border/world.geojson")
world_main = gpd.read_file("data/border/world_main.geojson")

world_capitals = gpd.read_file("data/world/capitals.geojson")

@app.route("/map")
def main_map():
    map = initMap()

    geojson_borders = [
        world
        # finland,
        # estonia,
        # latvia,
        # lithuania,
        # belarus
    ]

    start = request.args.get("start")
    end = request.args.get("end")
    through = request.args.get("through")

    if start is not None and end is not None:
        start = json.loads(start)
        end = json.loads(end)
        start = (start[1], start[0])
        end = (end[1], end[0])

        throughs = []
        if through is not None:
            through = json.loads(through)
            
            for point in through:
                throughs.append([point[1], point[0]])

        print(throughs)

        cross_points = directionsMap([world_main], gmaps, map, start, end, throughs)
        cross_points = []

        points = [
            start,
            end
        ]
        if throughs:
            for point in throughs:
                points.append(point)
        addMapPoints(map, points)
        
        map.fit_bounds([start, end])
    
    # for geojson_data in geojson_borders:
    #     addMapDot(map, geojson_data)
    
    addMapDot(map, world_main, "black")

    return renderMap(map, cross_points)

@app.route("/countries", methods=["GET"])
def countries():
    capitals = world_capitals.to_json()
    return capitals

def load_existing_data(file_path):
    """Load existing GeoJSON data from file."""
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            return json.load(file)
    return {"type": "FeatureCollection", "features": []}

@app.route('/save-geojson', methods=['POST'])
def save_geojson():
    # Ensure the request content type is JSON
    if not request.is_json:
        return jsonify({"error": "Request must be in JSON format"}), 400

    # Get the JSON data from the request
    data = request.get_json()

    # Check if the required fields are present
    if 'latitude' not in data or 'longitude' not in data:
        return jsonify({"error": "Request must contain 'latitude' and 'longitude'"}), 400

    latitude = data['latitude']
    longitude = data['longitude']

    # Load existing GeoJSON data
    geojson_file = 'data/border/world_main.geojson'
    existing_data = load_existing_data(geojson_file)

    # Create a new feature
    new_feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [longitude, latitude]
        },
        "properties": {}
    }

    # Append the new feature to existing features
    existing_data["features"].append(new_feature)

    # Save the updated GeoJSON data to a file
    try:
        with open(geojson_file, 'w') as file:
            json.dump(existing_data, file, indent=4)
        return jsonify({"message": "GeoJSON data saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# give hhtp example above with js
# http.get("http://localhost:5000/directions?start=moscow&end=istanbul")
