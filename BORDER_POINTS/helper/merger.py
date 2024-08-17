import geopandas as gpd
from shapely.geometry import Point
from shapely.ops import nearest_points
from shapely import geometry

def filter_close_points(gdf, threshold_meters):
    """
    Filters out points that are within a certain distance from each other.

    :param gdf: GeoDataFrame containing the points.
    :param threshold_meters: Distance threshold in meters.
    :return: A GeoDataFrame with close points removed.
    """
    # Create a GeoSeries from the points
    points = gdf.geometry

    # Use a list to store indices of points to keep
    to_keep = []
    seen = set()

    for i, point in enumerate(points):
        if i in seen:
            continue

        # Create a buffer around the point and find nearby points
        buffer = point.buffer(threshold_meters / 111320.0)  # Approximate conversion for lat/lon
        nearby_points = gdf[gdf.geometry.intersects(buffer)]

        # Keep the first point and mark others as seen
        to_keep.append(nearby_points.iloc[0])
        seen.update(nearby_points.index)

    return gpd.GeoDataFrame(to_keep, crs=gdf.crs)

# Load GeoJSON file
gdf = gpd.read_file('data.geojson')

# Filter points within 100 meters of each other
filtered_gdf = filter_close_points(gdf, 100)

# Save the filtered GeoDataFrame to a new GeoJSON file
filtered_gdf.to_file('filtered_data.geojson', driver='GeoJSON')

print("Filtered GeoJSON file saved as 'filtered_data.geojson'.")
