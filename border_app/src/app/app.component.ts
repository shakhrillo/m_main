import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { HttpClient } from '@angular/common/http';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  data = [] as any;
  coordinates: string = '0 | 0';
  geoJsonUrl = 'http://127.0.0.1:8000/entries';

  private map: L.Map | undefined;
  private routingControl: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const gibraltar = [36.15491, -5.349277] as L.LatLngExpression;
    this.map = L.map('map').setView(gibraltar, 4);

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   maxZoom: 18,
    //   attribution: '© OpenStreetMap contributors'
    // }).addTo(this.map);

    // // cycleOSM map
    // L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    //   maxZoom: 20,
    //   attribution: '© OpenStreetMap contributors'
    // }).addTo(this.map);

    // Transport map
    L.tileLayer('https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=16929083c4d1419b8237d64d6342fac0', {
      maxZoom: 22,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Load GeoJSON data
    this.loadGeoJson();
    // this.loadGeoJson_();

    // Hover over the map
    this.map.on('mousemove', (e) => {
      this.coordinates = `${e.latlng.lat.toFixed(5)} | ${e.latlng.lng.toFixed(5)}`;
    });

    // On right click
    this.map.on('contextmenu', (e) => {
      console.log('Right click');
      console.log(e.latlng);

      this.http.post(this.geoJsonUrl, {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      }).subscribe((data: any) => {
        console.log('Data posted');
        console.log(data);

        // Create a marker
        const marker = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: L.icon({
            iconUrl: 'assets/icons/border.png',
            iconSize: [32, 32]
          })
        });

        // Add the marker to the map
        marker.addTo(this.map as L.Map);
      });
    });

    // Draw france to istanbul bt road
    const france = [47.0, 2.0] as L.LatLngExpression;
    const istanbul = [41.0, 29.0] as L.LatLngExpression;
    this.routingControl = (L.Routing).control({
      waypoints: [
        L.latLng(france),
        L.latLng(istanbul)
      ],
      routeWhileDragging: false,
      routeDragInterval: 0,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: '#ff0000', opacity: 1, weight:3 }],
        extendToWaypoints: true,
        missingRouteTolerance: 100
      },
      ["createMarker" as any]: function(i:any, wp:any, nWps:any) {
        return L.marker(wp.latLng, {
          draggable: true,
          icon: L.icon({
            iconUrl: 'assets/icons/walk.png',
            iconSize: [36, 36]
          })
        });
      },
      show: false,
      addWaypoints: false,
      fitSelectedRoutes: !false
    }).addTo(this.map);

    // check routing crosses the border
    this.routingControl.on('routesfound', (e: any) => {
      const routes = e.routes;
      console.log(routes);
      // routes.forEach((route: any) => {
      //   const coordinates = route.coordinates;
      //   console.log(coordinates);
      //   this.http.get(`http://127.0.0.1:8000/entries2`).subscribe((data: any) => {
      //     console.log(data);
      //     const borderPoints = [[26.352487, 41.7176]];
      //     // console.log(borderPoints);
      //     const isCrossing = this.isRouteCrossingBorder(coordinates, borderPoints);
      //     console.log(isCrossing);
      //   })
      // });
    });
  }

  isRouteCrossingBorder(routeCoordinates: any, borderPoints: any): boolean {
    for (let i = 0; i < routeCoordinates.length; i++) {
      for (let j = 0; j < borderPoints.length; j++) {
        const routePoint = routeCoordinates[i];
        const borderPoint = borderPoints[j];
        // console.log('borderPoint', borderPoint);
        // console.log('routePoint', routePoint);
        const distance = this.getDistance([
          routePoint['lng'], routePoint['lat']
        ], borderPoint);
        // console.log(distance);
        if (distance < 0.1) {
          return true;
        }
      }
    }
    return false;
  }

  getDistance(point1: any, point2: any): number {
    const lat1 = point1[0];
    const lon1 = point1[1];
    const lat2 = point2[0];
    const lon2 = point2[1];

    // console.log(lat1, lon1, lat2, lon2);

    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private loadGeoJson(): void {
    // BORDER_POINTS/helper/data.geojson
    const geoJsonUrl = 'http://127.0.0.1:8000/entries2';
    // 'assets/gibraltar7.geojson'
    this.http.get(geoJsonUrl).subscribe((data: any) => {
      if (this.map) {
        // Create a marker cluster group
        const markers = L.markerClusterGroup();

        // Define the custom icon
        const customIcon = L.icon({
          iconUrl: 'assets/icons/border.png', // Path to your custom marker image
          iconSize: [32, 32], // Size of the icon
          iconAnchor: [16, 32], // Anchor point of the icon
          popupAnchor: [0, -32] // Popup position relative to the icon
        });

        // Create GeoJSON layer with clustering
        L.geoJSON(data, {
          pointToLayer: (feature, latlng) => {
            // Return a marker with the custom icon
            return L.marker(latlng, { icon: customIcon });
          }
        }).eachLayer((layer) => {
          markers.addLayer(layer);
        });

        // Add the cluster group to the map
        this.map.addLayer(markers);

        // Click on a marker
        markers.on('click', (e) => {
          const full_id = e.layer.feature.properties.full_id;
          this.deleteMarker(full_id);
        });
      }
    });
  }

  private loadGeoJson_(): void {
    // BORDER_POINTS/helper/data.geojson
    const geoJsonUrl = 'http://127.0.0.1:8000/entries';
    // 'assets/gibraltar7.geojson'
    this.http.get(geoJsonUrl).subscribe((data: any) => {
      if (this.map) {
        // Create a marker cluster group
        const markers = L.markerClusterGroup();

        // Define the custom icon
        const customIcon = L.icon({
          iconUrl: 'assets/icons/border.png', // Path to your custom marker image
          iconSize: [32, 32], // Size of the icon
          iconAnchor: [16, 32], // Anchor point of the icon
          popupAnchor: [0, -32] // Popup position relative to the icon
        });

        // Create GeoJSON layer with clustering
        L.geoJSON(data, {
          pointToLayer: (feature, latlng) => {
            // Return a marker with the custom icon
            return L.marker(latlng);
          }
        }).eachLayer((layer) => {
          markers.addLayer(layer);
        });

        // Add the cluster group to the map
        this.map.addLayer(markers);

        // Click on a marker
        markers.on('click', (e) => {
          const full_id = e.layer.feature.properties.full_id;
          this.deleteMarker(full_id);
        });
      }
    });
  }

  deleteMarker(full_id: string): void {
    console.log('Delete marker');
    console.log(full_id);
    this.http.delete(`http://127.0.0.1:8000/entries/${full_id}`).subscribe(() => {
      console.log('Marker deleted');
      // remove from the map also
      
      // find the marker and remove it
      this.map!.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          const marker = layer as L.Marker;
          if (marker.feature!.properties.full_id === full_id) {
            this.map?.removeLayer(marker);
          }
        }
      });

    });
  }
}