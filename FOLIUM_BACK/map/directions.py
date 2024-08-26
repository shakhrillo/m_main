import math
import folium
import googlemaps
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import polyline
from geopy.distance import great_circle

from map.crossed_check_point import crossed_check_point

# import bbox.json
import json
with open("data/border_box/world_bbox.json") as f:
  world_bbox = json.load(f)

def is_point_in_bbox(lat, lng, bbox):
    """
    Check if a point is inside the bounding box.

    Parameters:
    - lat (float): Latitude of the point.
    - lng (float): Longitude of the point.
    - bbox (dict): Bounding box defined by northeast and southwest corners.

    Returns:
    - bool: True if the point is inside the bounding box, False otherwise.
    """
    # Bounding box corners
    northeast = bbox['northeast']
    southwest = bbox['southwest']

    # Check if the point is within the bounding box
    return (southwest['lat'] <= lat <= northeast['lat'] and
            southwest['lng'] <= lng <= northeast['lng'])

def get_location_details(gmaps, lat, lng):
    # Perform reverse geocoding
    reverse_geocode_result = gmaps.reverse_geocode((lat, lng))
    
    if reverse_geocode_result:
        # Extract the first result
        result = reverse_geocode_result[0]
        
        # Extract address components
        address_components = result['address_components']
        country = None
        for component in address_components:
            if 'country' in component['types']:
                country = component['long_name']
                break
        
        return country, lat, lng
    else:
        return None, None, None

def filter_close_points(coords, threshold_meters):
    filtered_coords = [coords[0]]
    
    for i in range(1, len(coords)):
        distance = great_circle(filtered_coords[-1], coords[i]).meters
        if distance >= threshold_meters:
            filtered_coords.append(coords[i])
    
    return filtered_coords

def directionsMap(geojson_borders, gmaps, map, origin, destination, waypoints=[]):
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

    frist_point = points[0]
    last_point = points[-1]
    whole_distance = great_circle(frist_point, last_point).meters
    print("Whole distance:", whole_distance)

    threshold = whole_distance / 30
    print("Threshold:", threshold)
    filtered_coords = filter_close_points(points, threshold)
    # filtered_coords = points

    # get bounding box of the france
    # bbox = gmaps.geocode("France")[0]["geometry"]["bounds"]
    europe_bbox = {
      'northeast': {'lat': 71.1850, 'lng': 31.2683},
      'southwest': {'lat': 34.5146, 'lng': -25.0028}
    }
    asia_bbox = {
      'northeast': {'lat': 77.0489, 'lng': 180.0000},
      'southwest': {'lat': -10.3597, 'lng': 25.2442}
    }
    africa_bbox = {
      'northeast': {'lat': 37.2, 'lng': 51.0},
      'southwest': {'lat': -34.8, 'lng': -18.0}
    }
    australia_bbox = {
      'northeast': {'lat': -10.0, 'lng': 159.1},
      'southwest': {'lat': -43.7, 'lng': 112.9}
    }
    north_america_bbox = {
      'northeast': {'lat': 83.0, 'lng': -22.0},
      'southwest': {'lat': 7.0, 'lng': -169.0}
    }
    south_america_bbox = {
      'northeast': {'lat': 12.5, 'lng': -34.0},
      'southwest': {'lat': -56.0, 'lng': -81.0}
    }
    bboxes = [
      europe_bbox,
      asia_bbox,
      africa_bbox,
      australia_bbox,
      north_america_bbox,
      south_america_bbox
    ]

    for b in world_bbox:
      # [60.5284298033, 29.318572496, 75.1580277851, 38.4862816432]
      bbox = b["bbox"]
      # print("BBOX:", bbox)
      if b["name"] == "CN":
        folium.PolyLine(
          locations=[
            (bbox[0], bbox[1]),
            (bbox[2], bbox[1]),
            (bbox[2], bbox[3]),
            (bbox[0], bbox[3]),
            (bbox[0], bbox[1])
          ],
          color="#FF0000",
          weight=5,
          opacity=0.8,
        ).add_to(map)

    # ADD MAP POINT
    # for coord in filtered_coords:
      # extracted_country = get_location_details(gmaps, coord[0], coord[1])

      # print("Extracted country:", extracted_country)

      # if is_point_in_bbox(coord[0], coord[1], bbox):
      #   folium.Marker(
      #     location=coord,
      #     popup="Point",
      #     icon=folium.Icon(color="green"),
      #     id="point",
      #     # country=extracted_country
      #   ).add_to(map)

      # folium.Marker(
      #   location=coord,
      #   popup="Point",
      #   icon=folium.Icon(color="red"),
      #   id="point",
      #   # country=extracted_country
      # ).add_to(map)

    # save decoded route as geojson
    # with open("data/decoded/decoded_route.geojson", "w") as f:
    #   f.write("{\n")
    #   f.write('"type": "FeatureCollection",\n')
    #   f.write('"features": [\n')
    #   f.write("{\n")
    #   f.write('"type": "Feature",\n')
    #   f.write('"properties": {},\n')
    #   f.write('"geometry": {\n')
    #   f.write('"type": "LineString",\n')
    #   f.write('"coordinates": [\n')
    #   for coord in filtered_coords:
    #     # check country name
    #     # geolocator = Nominatim(user_agent="geoapiExercises")
    #     # try:
    #     #   location = geolocator.reverse(f"{coord[1]}, {coord[0]}", language="en")
    #     #   print(location.raw["address"]["country"])
    #     # except GeocoderTimedOut:
    #     #   print("GeocoderTimedOut")
    #     f.write(f"[{coord[1]}, {coord[0]}, 0],\n")
    #   f.seek(f.tell() - 2, 0)
    #   f.write("]\n")
    #   f.write("}\n")
    #   f.write("}\n")
    #   f.write("]\n")
    #   f.write("}\n")
    
    cross_points = crossed_check_point(map, decoded_route, geojson_borders)

    folium.PolyLine(
      locations=[
        points
      ],
      color="#FF0000",
      weight=5,
      opacity=0.8,
    ).add_to(map)

    print("Cross points:", cross_points)

    return cross_points
    # return []

  else:
    print("No routes found")
    return None