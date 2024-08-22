from flask import Flask, json, render_template_string
import folium
import googlemaps
from geopy.distance import geodesic
from shapely.geometry import Point
import shapely.geometry as sg
from shapely.geometry import box
import geopandas as gpd
from shapely.geometry import Polygon

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

@app.route("/")
def fullscreen():
    """Simple example of a fullscreen map."""
    m = folium.Map()
    return m.get_root().render()

# def is_within_bounding_box(lat, lon, bbox):
#     polygon = box(*bbox)  # Create a bounding box polygon
#     point = Point(lon, lat)  # Create a point with (lon, lat) coordinates
#     return point.within(polygon)

@app.route("/components")
def components():
    m = folium.Map(
        width=800,
        height=600,
    )

    moscow = [55.7558, 37.6176]
    paris = moscow
    cape_town = [-33.9249, 18.4241]

    crossed_countries = []

    # Request directions
    directions_result = gmaps.directions(
        origin=paris,
        destination=cape_town,
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
            color="blue",
            weight=5,
            opacity=0.8,
        ).add_to(m)

        print(len(points))
        # print(points)
        # radius = 100

        polygon = Polygon(points)

        path_ = "/Users/shakhrillo/Desktop/m_main/FOLIUM_BACK/data/110m_cultural/ne_110m_admin_0_countries.shp"
        world = gpd.read_file(path_)

        # print(world.columns)

        # world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))

        polygon_gdf = gpd.GeoDataFrame({'geometry': [polygon]}, crs="EPSG:4326")

        intersections = world[world.intersects(polygon_gdf.unary_union)]

        # Inspect the results
        print(intersections)
        # print(intersections.columns) 

        # save points json
        # with open("data/points.json", "w") as f:
        #     json.dump(points, f)
        
        # for point in points:
        #     latitude_to_check, longitude_to_check = point
            
        #     for country in countries:
        #         coordinates = country["coordinates"]
                
        #         if is_within_bounding_box(latitude_to_check, longitude_to_check, coordinates):
        #             if country["name"] not in crossed_countries:
        #                 crossed_countries.append(country["name"])
        #                 break
                
    else:
        print("No routes found")

    print(f"Crossed countries: {crossed_countries}")
    print(len(crossed_countries))
    # extend the bounds of the map
    m.fit_bounds([paris, cape_town])

    m.get_root().render()
    header = m.get_root().header.render()
    body_html = m.get_root().html.render()
    script = m.get_root().script.render()

    return render_template_string(
        """
            <!DOCTYPE html>
            <html>
                <head>
                    {{ header|safe }}
                </head>
                <body>
                    {{ body_html|safe }}
                    <script>
                        {{ script|safe }}
                    </script>
                </body>
            </html>
        """,
        header=header,
        body_html=body_html,
        script=script,
    )