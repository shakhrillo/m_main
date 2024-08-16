import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  data = [] as any;

  private map: L.Map | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const gibraltar = [36.15491, -5.349277] as L.LatLngExpression;
    this.map = L.map('map').setView(gibraltar, 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Load GeoJSON data
    this.loadGeoJson();
  }

  private loadGeoJson(): void {
    this.http.get('assets/gibraltar.geojson').subscribe((data: any) => {
      if (this.map) {
        L.geoJSON(data).addTo(this.map);
      }
    });
  } 
}
