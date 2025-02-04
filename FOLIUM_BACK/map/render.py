from flask import render_template_string

def renderMap(map, cross_points):
  map.get_root().render()
  header = map.get_root().header.render()
  body_html = map.get_root().html.render()
  script = map.get_root().script.render()

  # make map global inside the js
  script = script.replace("var map_", "window.map_")
  
  if cross_points:
    script += """
      window.map_cross_points = %s;
    """ % cross_points

  # add L as a global variable
  script += """
    window.L = L;
  """

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