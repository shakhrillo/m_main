import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

import { faCoffee, faMap } from '@fortawesome/free-solid-svg-icons';

(L.Control as any).MousePosition = (L.Control as any).extend({
  options: {
    position: 'bottomright',
    separator: ' : ',
    emptyString: 'Unavailable',
    lngFirst: false,
    numDigits: 5,
    lngFormatter: undefined,
    latFormatter: undefined,
    prefix: ""
  },

  onAdd: function (map: any) {
    this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
    L.DomEvent.disableClickPropagation(this._container);
    map.on('mousemove', this._onMouseMove, this);
    this._container.innerHTML=this.options.emptyString;
    return this._container;
  },

  onRemove: function (map: any) {
    map.off('mousemove', this._onMouseMove)
  },

  _onMouseMove: function (e: any) {
    const latLngToDMS = (lat: number, lng: number) => {
        const toDMS = (val: number) => {
            const absVal = Math.abs(val);
            const degrees = Math.floor(absVal);
            const minutes = Math.floor((absVal - degrees) * 60);
            const seconds = ((absVal - degrees) * 60 - minutes) * 60;
            return `${degrees}°${minutes}'${seconds.toFixed(2)}"`;
        };

        const latDMS = `${lat >= 0 ? 'N' : 'S'}${toDMS(lat)}`;
        const lngDMS = `${lng >= 0 ? 'E' : 'W'}${toDMS(lng)}`;
        return { latDMS, lngDMS };
    };

    const { lat, lng } = e.latlng;
    const { latDMS, lngDMS } = latLngToDMS(lat, lng);

    // Combine lat and lng into the desired format
    const value = this.options.lngFirst ? `${lngDMS} ${latDMS}` : `${latDMS} ${lngDMS}`;
    const prefixAndValue = this.options.prefix + ' ' + value;
    
    this._container.innerHTML = prefixAndValue;
  }


});

L.Map.mergeOptions({
    positionControl: false
});

L.Map.addInitHook(function (this: any) {
    if (this.options.positionControl) {
        this.positionControl = new (L.Control as any).MousePosition();
        this.addControl(this.positionControl);
    }
});

(L.control as any).mousePosition = function (options: any) {
    return new (L.Control as any).MousePosition(options);
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private map: any;
  public faMap = faMap;

  private initMap(): void {
    this.map = L.map('leaflet-map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3,
      zoomControl: false
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // leaflet control scale options
    const scaleOptions = {
      position: 'bottomleft',
      metric: true,
      imperial: true,
      updateWhenIdle: false
    };

    // leaflet control scale
    const scale = L.control.scale(scaleOptions as L.Control.ScaleOptions);

    // add scale to map
    scale.addTo(this.map);

    // zoom control option
    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);
    
    // Mouse position control
    (L.control as any).mousePosition().addTo(this.map);


    tiles.addTo(this.map);

    // driving directions from moscow to berlin
    const route = L.Routing.control({
      waypoints: [
        L.latLng(55.7558, 37.6176),
        L.latLng(
          52.11645103330338,
          23.565991994138614
        ),
        L.latLng(52.5200, 13.4050)
      ],
      routeWhileDragging: true
    });
    
    route.on('routesfound', (e: any) => {
      const routes = e.routes;
      console.log(routes);

      for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const coordinates = route.coordinates;

        const blob = new Blob([JSON.stringify(coordinates)], { type: 'application/json' });
        console.log(route['name']);
        console.log(coordinates);
        console.log(blob);
        console.log('size in kilobytes: ', blob.size / 1024);
      }
    });

    // console.log((route as any)._routes[0].coordinates);
    
    const coordinates = route.getRouter();

    console.log(coordinates);

    route.addTo(this.map);
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }
}