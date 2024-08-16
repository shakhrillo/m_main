import { AfterViewInit, Component } from '@angular/core';

import * as L from "leaflet";
import * as geojson from "geojson";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  private map: L.Map | undefined;

  private initMap(): void {
    this.map = L.map('map', {
      center: [46.2276, 2.2137],
      zoom: 5
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'Open Street Map'
    });

    tiles.addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
  //  this.addBorders();
  }
  
  data = [
    {
      "id": 1,
      "name": "Mont Blanc Tunnel",
      "country_from": "France",
      "country_to": "Italy",
      "coordinates": {
        "lat": 45.8326,
        "long": 6.8652
      }
    },
    {
      "id": 2,
      "name": "Frejus Tunnel",
      "country_from": "France",
      "country_to": "Italy",
      "coordinates": {
        "lat": 45.1452,
        "long": 6.7222
      }
    },
    {
      "id": 3,
      "name": "Fernetti Border Crossing",
      "country_from": "Italy",
      "country_to": "Slovenia",
      "coordinates": {
        "lat": 45.6848,
        "long": 13.8347
      }
    },
    {
      "id": 4,
      "name": "Obrežje Border Crossing",
      "country_from": "Slovenia",
      "country_to": "Croatia",
      "coordinates": {
        "lat": 45.8331,
        "long": 15.6774
      }
    },
    {
      "id": 5,
      "name": "Bajakovo Border Crossing",
      "country_from": "Croatia",
      "country_to": "Serbia",
      "coordinates": {
        "lat": 45.0755,
        "long": 19.1314
      }
    },
    {
      "id": 6,
      "name": "Gradina Border Crossing",
      "country_from": "Serbia",
      "country_to": "Bulgaria",
      "coordinates": {
        "lat": 43.1347,
        "long": 22.6483
      }
    },
    {
      "id": 7,
      "name": "Kapitan Andreevo Border Crossing",
      "country_from": "Bulgaria",
      "country_to": "Turkey",
      "coordinates": {
        "lat": 41.7178,
        "long": 26.3221
      }
    }
  ]
  
}
