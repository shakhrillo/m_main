import folium
import googlemaps

def directionsMap(gmaps, map):
  moscow = [55.7558, 37.6176]
  paris = moscow
  cape_town = [-33.9249, 18.4241]

  directions_result = gmaps.directions(
    origin=paris,
    destination=cape_town,
    mode="driving",
    waypoints=[
      "42.74694557147825,44.62293974596122"
    ]
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