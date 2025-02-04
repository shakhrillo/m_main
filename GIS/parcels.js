require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GraphicsLayer",
    "esri/Graphic"
], function(Map, MapView, GraphicsLayer, Graphic) {

    // Create a map with a basemap
    var map = new Map({
        basemap: "streets-navigation-vector"
    });

    // Create a MapView to display the map
    var view = new MapView({
        container: "viewDiv", // Reference to the DOM node that will contain the view
        map: map, // References the map object created in step 3
        center: [-118.80500, 34.02700], // Longitude, latitude
        zoom: 13 // Zoom level
    });

    // Create a GraphicsLayer to hold the parcel graphics
    var parcelsLayer = new GraphicsLayer();
    map.add(parcelsLayer);

    // Define a simple marker symbol for parcels
    var parcelSymbol = {
        type: "simple-marker",
        color: "red",
        size: "8px"
    };

    // Define some example parcel data
    var parcels = [
        { id: 1, latitude: 34.02700, longitude: -118.80500 },
        { id: 2, latitude: 34.02800, longitude: -118.80600 },
        { id: 3, latitude: 34.02900, longitude: -118.80700 }
    ];

    // Add parcels to the map as graphics
    parcels.forEach(function(parcel) {
        var point = {
            type: "point",
            latitude: parcel.latitude,
            longitude: parcel.longitude
        };

        var graphic = new Graphic({
            geometry: point,
            symbol: parcelSymbol,
            attributes: parcel,
            popupTemplate: {
                title: "Parcel ID: {id}",
                content: "Latitude: {latitude}<br>Longitude: {longitude}"
            }
        });

        parcelsLayer.add(graphic);
    });
});
