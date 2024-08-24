from flask import render_template_string

def renderMap(map):
  map.get_root().render()
  header = map.get_root().header.render()
  body_html = map.get_root().html.render()
  script = map.get_root().script.render()

  # make map global inside the js
  script = script.replace("var map_", "window.map_")
  # print(script)

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