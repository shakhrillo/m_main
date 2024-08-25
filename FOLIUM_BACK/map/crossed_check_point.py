from haversine import haversine, Unit

def crossed_check_point(map, decoded_route, geojson_borders):
  cross_points = []

  for coord in decoded_route:
    for geojson_data in geojson_borders:
      for index, row in geojson_data.iterrows():
        lat = row.geometry.centroid.coords[0][1]
        lng = row.geometry.centroid.coords[0][0]
        
        distance = haversine((lat, lng), coord, unit=Unit.KILOMETERS)

        if distance < 30:
          closest_point = {
            "lat": lat,
            "lng": lng,
            "distance": distance,
            "country": row["country"],
            "name": row["name"],
          }
          
          if closest_point["name"] not in [point["name"] for point in cross_points]:
            cross_points.append(closest_point)

  return cross_points