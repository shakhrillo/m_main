from flask import Flask, json, render_template_string
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

# with open("data/countries.json") as f:
#     countries = json.load(f)

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

# import findland json
finland = gpd.read_file("data/border/finland.geojson")
estonia = gpd.read_file("data/border/estonia.geojson")
latvia = gpd.read_file("data/border/latvia.geojson")
lithuania = gpd.read_file("data/border/lithuania.geojson")

@app.route("/components")
def components():
    moscow = [55.7558, 37.6176]
    istanbul = [41.0082, 28.9784]
    verkhny_lars = [42.7022, 44.6277]
    sarp = [41.7167, 42.0000]
    # estonia = [58.5953, 25.0136]

    latvia_kpp = [56.87081803558701, 27.832182563513896]

    start = moscow
    end = istanbul
    
    map = initMap()
    directionsMap(gmaps, map, start, end, [latvia_kpp])
    addMapPoints(map, [start, end])
    addMapCrossPoint(map, [verkhny_lars, sarp])

    geojson_borders = [
        finland,
        estonia,
        latvia,
        lithuania,
    ]

    for geojson_data in geojson_borders:
        addMapDot(map, geojson_data)

    map.fit_bounds([start, end])
    return renderMap(map)

