from flask import Flask, json, render_template_string

import folium
import googlemaps

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


@app.route("/iframe")
def iframe():
    """Embed a map as an iframe on a page."""
    m = folium.Map()

    # set the iframe width and height
    m.get_root().width = "800px"
    m.get_root().height = "600px"
    iframe = m.get_root()._repr_html_()

    return render_template_string(
        """
            <!DOCTYPE html>
            <html>
                <head></head>
                <body>
                    <h1>Using an iframe</h1>
                    {{ iframe|safe }}
                </body>
            </html>
        """,
        iframe=iframe,
    )


@app.route("/components")
def components():
    """Extract map components and put those on a page."""
    m = folium.Map(
        width=800,
        height=600,
    )

    paris = [48.8566, 2.3522]
    moscow = [55.7558, 37.6176]
    japan = [35.6895, 139.6917]
    south_korea = [37.5665, 126.9780]
    pakistan = [30.3753, 69.3451]
    islamabad = [33.6844, 73.0479]
    hochiminh = [10.8107, 106.7501]
    cape_town = [-33.9249, 18.4241]


    # Request directions
    directions_result = gmaps.directions(
        origin=paris,
        destination=cape_town,
    )

    if directions_result:
        route_polyline = directions_result[0]["overview_polyline"]["points"]
        
        # Decode the polyline
        decoded_route = googlemaps.convert.decode_polyline(route_polyline)
        
        points = []
        # # print("Decoded route:", decoded_route[0])
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
        
        # Check if decoded_route is a list of tuples with length 2
        # if all(isinstance(coord, tuple) and len(coord) == 2 for coord in decoded_route):
        #     folium.PolyLine(
        #         locations=decoded_route,
        #         color="blue",
        #         weight=5,
        #         opacity=0.8,
        #     ).add_to(m)
            
        #     print("Decoded route is in the correct format")
        # else:
        #     print("Decoded route is not in the correct format")
        #     print("Route format check:", [(type(coord), len(coord)) for coord in decoded_route])
    else:
        print("No routes found")

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