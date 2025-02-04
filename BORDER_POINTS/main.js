const API_URL = "http://127.0.0.1:8000";
const map = L.map('map')

fetch(`${API_URL}/border/gr/tr`)
  .then(response => response.json())
  .then(data => {
    // map.setView(
    //   [
    //     (41.0052041 + 41.9099533) / 2,
    //     (28.847374 + 12.3711926) / 2
    //   ],
    //   10);

    // remove zoom control
    map.zoomControl.remove();

    // disable drag and zoom handlers
    // map.dragging.disable();
    // map.touchZoom.disable();
    // map.doubleClickZoom.disable();
    // map.scrollWheelZoom.disable();

    // // disable tap handler, if present.
    // if (map.tap) map.tap.disable();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // maxZoom: 10,
      attribution: '© OpenStreetMap'
    }).addTo(map);


    // data["gr"].forEach((point) => {
    //   lMarker(point, map, 'GR');
    // });
    // lMarker(data["gr"], map, 'GR');
    // data["tr"].forEach((point) => {
    //   lMarker(point, map, 'TR');
    // });

    // Driving route
    // Define the waypoints
var waypoint1 = L.latLng(41.9099533, 12.3711926);
var waypoint2 = L.latLng(41.0052041, 28.847374);

// Define the midpoint or split point (this can be adjusted based on your needs)
var midpoint = L.latLng((waypoint1.lat + waypoint2.lat) / 2, (waypoint1.lng + waypoint2.lng) / 2);

// Create the two routes
L.Routing.control({
  waypoints: [waypoint1, midpoint],
  routeWhileDragging: false,
  show: false,
  lineOptions: {
    styles: [{
      color: 'red',
      opacity: 1,
      weight: 6,
    }]
  }
}).addTo(map);

L.Routing.control({
  waypoints: [midpoint, waypoint2],
  routeWhileDragging: false,
  show: false,
  lineOptions: {
    styles: [{
      color: 'yellow',
      opacity: 1,
      weight: 6,
    }]
  }
}).addTo(map);

    data.forEach((point) => {
      lMarker(
        [
          point["lat"],
          point["lng"]
        ],
        map,
        point["country"]
      );
    });

    // data["bg"].forEach((point) => {
    //   lMarker(point, map, 'BG');
    // });
    // data["tr"].forEach((point) => {
    //   lMarker(point, map, 'TR');
    // });
    // data["gr"].forEach((point) => {
    //   lMarker(point, map, 'GR');
    // });
    // data["al"].forEach((point) => {
    //   lMarker(point, map, 'AL');
    // });
    // data["mkd"].forEach((point) => {
    //   lMarker(point, map, 'MKD');
    // });

    // data["road"].forEach((point) => {
    //   L.polyline(point, {
    //     color: '#ff0000',
    //     weight: 5,
    //     opacity: 1,
    //     dashArray: '20,15',
    //   }).addTo(map);
    // });

    // L.polyline(data["road"], {
    //   color: '#ff0000',
    //   weight: 20,
    //   opacity: 1,
    // }).addTo(map);

    // L.polyline(data["border"], {
    //   color: '#ff0000',
    //   weight: 5,
    //   opacity: 1,
    //   dashArray: '20,15',
    // }).addTo(map);

    // console.log(data);
  });