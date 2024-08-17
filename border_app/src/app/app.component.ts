import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  data = [] as any;
  coordinates: string = '0 | 0';

  private map: L.Map | undefined;

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

    // Load GeoJSON data
    this.loadGeoJson();

    // Hover over the map
    this.map.on('mousemove', (e) => {
      this.coordinates = `${e.latlng.lat.toFixed(5)} | ${e.latlng.lng.toFixed(5)}`;
    });

  }

  private loadGeoJson(): void {
    this.http.get('assets/gibraltar9.geojson').subscribe((data: any) => {
      if (this.map) {
        L.geoJSON(data).addTo(this.map);
      }


    });
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