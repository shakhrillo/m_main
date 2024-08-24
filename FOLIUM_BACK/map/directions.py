import folium
import googlemaps

def directionsMap(gmaps, map, origin, destination, waypoints=[]):
  directions_result = gmaps.directions(
    origin=origin,
    destination=destination,
    waypoints=waypoints
  )

  if directions_result:
    route_polyline = directions_result[0]["overview_polyline"]["points"]
    decoded_route = googlemaps.convert.decode_polyline(route_polyline)
    points = []
    
    for coord in decoded_route:
      points.append(
        (coord['lat'], coord['lng'])
      )

    folium.PolyLine(
      locations=points,
      color="#f1c40f",
      weight=5,
      opacity=0.8,
    ).add_to(map)

  else:
    print("No routes found")