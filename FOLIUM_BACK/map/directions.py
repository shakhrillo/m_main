import math
import folium
import googlemaps
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import polyline

from map.crossed_check_point import crossed_check_point

def directionsMap(gmaps, map, origin, destination, waypoints=[]):
  directions_result = gmaps.directions(
    origin=origin,
    destination=destination,
    waypoints=waypoints
  )


  if directions_result:
    route_polyline = directions_result[0]["overview_polyline"]["points"]
    decoded_route = polyline.decode(route_polyline)

    points = []
    
    for coord in decoded_route:
      points.append(coord)
    
    # cross_points = crossed_check_point(map, decoded_route, geojson_borders)

    folium.PolyLine(
      locations=points,
      color="#FF0000",
      weight=5,
      opacity=0.8,
    ).add_to(map)

    # print("Cross points:", cross_points)

    # return cross_points
    return []

  else:
    print("No routes found")
    return None