import folium
from xyzservices import TileProvider

tile_provider = TileProvider(
    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution="Google",
    name="Google Maps",
)

def initMap():
    map = folium.Map(
        # location=[60.1695, 24.9354],
        zoom_start=6,
        tiles="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        attr="Google",
    )
    return map