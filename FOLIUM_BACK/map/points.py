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

def addMapDot(map, point, color="red"):
  folium.CircleMarker(
    location=[point[1], point[0]],
    radius=5,
    color=color,
    fill=True,
    fill_color=color,
    fill_opacity=0.6,
  ).add_to(map)
