import math
import folium
import googlemaps
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import polyline

def haversine(lat1, lon1, lat2, lon2):
  # Radius of Earth in kilometers
  R = 6371.0
  
  # Convert latitude and longitude from degrees to radians
  lat1_rad = math.radians(lat1)
  lon1_rad = math.radians(lon1)
  lat2_rad = math.radians(lat2)
  lon2_rad = math.radians(lon2)
  
  # Compute differences
  dlat = lat2_rad - lat1_rad
  dlon = lon2_rad - lon1_rad
  
  # Haversine formula
  a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
  c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
  
  # Distance in kilometers
  distance = R * c
  
  return distance

def is_within_proximity(lat1, lon1, lat2, lon2, max_distance_km):
  distance = haversine(lat1, lon1, lat2, lon2)
  return distance <= max_distance_km

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
    cross_points = []

    print(decoded_route)
    
    for coord in decoded_route:
      points.append(coord)

      # Get country of each point

      closest_point = None
      for geojson_data in geojson_borders:
        for index, row in geojson_data.iterrows():
          lat = row.geometry.centroid.coords[0][1]
          lng = row.geometry.centroid.coords[0][0]
          distance = haversine(coord[1], coord[0], lat, lng)

          if distance < 8:
            closest_point = {
              "lat": lat,
              "lng": lng,
              "distance": distance,
              "country": row["country"],
              "name": row["name"],
            }

      if closest_point is not None:
        if closest_point["name"] not in [point["name"] for point in cross_points]:
          cross_points.append(closest_point)

    folium.PolyLine(
      locations=points,
      color="#FF0000",
      weight=5,
      opacity=0.8,
    ).add_to(map)

    return cross_points

  else:
    print("No routes found")
    return None