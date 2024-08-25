from flask import Flask, json, render_template_string, request
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

world_capitals = gpd.read_file("data/world/capitals.geojson")

@app.route("/map")
def main_map():
    map = initMap()

    geojson_borders = [
        finland,
        estonia,
        latvia,
        lithuania,
        belarus
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

        cross_points = directionsMap(geojson_borders, gmaps, map, start, end, throughs)

        points = [
            start,
            end
        ]
        if throughs:
            for point in throughs:
                points.append(point)
        addMapPoints(map, points)
        
        map.fit_bounds([start, end])
    
    for geojson_data in geojson_borders:
        addMapDot(map, geojson_data)

    return renderMap(map, cross_points)

@app.route("/countries", methods=["GET"])
def countries():
    capitals = world_capitals.to_json()
    return capitals

# give hhtp example above with js
# http.get("http://localhost:5000/directions?start=moscow&end=istanbul")
