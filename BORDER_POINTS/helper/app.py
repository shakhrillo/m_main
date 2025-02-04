from flask import Flask, render_template_string
import folium

app = Flask(__name__)

@app.route("/")
def fullscreen():
    """Simple example of a fullscreen map."""
    m = folium.Map()
    map_html = m._repr_html_()  # Get the map HTML representation
    return render_template_string(
        """
            <!DOCTYPE html>
            <html>
                <head></head>
                <body>
                    {{ map_html|safe }}
                </body>
            </html>
        """,
        map_html=map_html
    )

@app.route("/iframe")
def iframe():
    """Embed a map as an iframe on a page."""
    m = folium.Map()

    # Set the iframe width and height
    iframe_html = m._repr_html_()

    return render_template_string(
        """
            <!DOCTYPE html>
            <html>
                <head></head>
                <body>
                    <h1>Using an iframe</h1>
                    <iframe srcdoc="{{ iframe_html|safe }}" width="800" height="600"></iframe>
                </body>
            </html>
        """,
        iframe_html=iframe_html,
    )

@app.route("/components")
def components():
    """Extract map components and put those on a page."""
    m = folium.Map(
        width=800,
        height=600,
    )

    map_html = m._repr_html_()
    
    return render_template_string(
        """
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        #mapid {
                            width: 800px;
                            height: 600px;
                        }
                    </style>
                </head>
                <body>
                    <h1>Using components</h1>
                    <div id="mapid">{{ map_html|safe }}</div>
                    <script>
                        // Any custom JavaScript code you want to include
                    </script>
                </body>
            </html>
        """,
        map_html=map_html
    )

if __name__ == "__main__":
    app.run(debug=True)
