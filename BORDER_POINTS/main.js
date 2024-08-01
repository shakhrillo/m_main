const API_URL = "http://127.0.0.1:8000";
const map = L.map('map')

fetch(`${API_URL}/border/gr/tr`)
  .then(response => response.json())
  .then(data => {
    map.setView(
      data["view"],
      10);

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
    L.Routing.control({
      waypoints: [
        L.latLng(41.9099533,12.3711926),
        L.latLng(41.0052041,28.847374)
      ],
      routeWhileDragging: true,
      show: false,
      lineOptions: {
        styles: [{ color: 'red', opacity: 1, weight: 5 }]
      }
    }).addTo(map);

    data["bg"].forEach((point) => {
      lMarker(point, map, 'BG');
    });
    data["tr"].forEach((point) => {
      lMarker(point, map, 'TR');
    });
    data["gr"].forEach((point) => {
      lMarker(point, map, 'GR');
    });
    data["al"].forEach((point) => {
      lMarker(point, map, 'AL');
    });
    data["mkd"].forEach((point) => {
      lMarker(point, map, 'MKD');
    });

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

    console.log(data);
  });