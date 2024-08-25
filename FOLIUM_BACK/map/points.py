import folium

def addMapPoints(map, points):
  for point in points:
    folium.Marker(
      location=[point[0], point[1]],
      # popup=point['popup'],
      # icon=folium.Icon(color=point['color'])
    ).add_to(map)

def addMapCrossPoint(map, points):
  for point in points:
    folium.Marker(
      location=[
        point[0],
        point[1]
      ],
      popup="This is a test",
      icon=folium.Icon(color="red"),
    ).add_to(map)

def addMapDot(map, geojson_data, color="green"):
  for index, row in geojson_data.iterrows():
    lat = row.geometry.centroid.coords[0][1]
    lng = row.geometry.centroid.coords[0][0]
    # description = row["name:en"]

    # status = row["status"]
    # color = "green"
    # if status == "closed":
    #   color = "red"
    # elif status == "warning":
    #   color = "orange"

    # popup_text = f"Lat: {lat}, Lng: {lng}<br>Status: {status}"
    
    circleMarker = folium.CircleMarker(
      location=[lat, lng],
      radius=3,
      color=color,
      fill=False,
      fill_color=color,
      fill_opacity=0.6,
      tooltip=[lat, lng]
    )

    circleMarker.add_to(map)
