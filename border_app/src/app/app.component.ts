import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

import { faRoute, faMap, faTimes } from '@fortawesome/free-solid-svg-icons';
import { MapService } from './services/map.service';

const weatherApiKey = "fc61665737d2e0ceb93f78e7188d861f";

const locationPinSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"/></svg>';
const shieldSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M32 32C14.3 32 0 46.3 0 64L0 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-181.7L149.2 96 64 96l0-32c0-17.7-14.3-32-32-32zM405.2 96l-74.3 0-5.4 10.7L234.8 288l74.3 0 5.4-10.7L405.2 96zM362.8 288l74.3 0 5.4-10.7L533.2 96l-74.3 0-5.4 10.7L362.8 288zM202.8 96l-5.4 10.7L106.8 288l74.3 0 5.4-10.7L277.2 96l-74.3 0zm288 192l85.2 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-384c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.7L490.8 288z"/></svg>';

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
  public faRoute = faRoute;
  public faTimes = faTimes;

  private initMap(): void {
    this.map = L.map('leaflet-map', {
      // center: [ 39.8282, -98.5795 ],
      // zoom: 3,
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
        )
        // L.latLng(52.5200, 13.4050)
      ],
      routeWhileDragging: true,
      ["lineOptions" as any]: {
        styles: [
          { 
            color: 'orange',
            opacity: 0.8,
            weight: 8
          }
        ]
      },
      // disable adding waypoints by dragging the route
      ["draggableWaypoints" as any]: false,
      // disable adding waypoints by clicking the map
      ["addWaypoints" as any]: false,
      // change custom point icon
      ["createMarker" as any]: (i: number, wp: any, nWps: number) => {
        if (i === 0) {
          return L.marker(wp.latLng, {
            icon: L.divIcon({
              className: 'custom-icon',
              html: locationPinSvg,
              iconSize: [24, 24]
            })
          });
        }

        return L.marker(wp.latLng, {
          icon: L.divIcon({
            className: 'custom-icon',
            html: locationPinSvg,
            iconSize: [24, 24]
          })
        });
      },


            
    });
    
    route.on('routesfound', (e: any) => {
      const routes = e.routes;

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

    // Points list
    const points = [
      [23.565991994138614,52.61645103330338],
      [24.01066201210699,50.67744924933163],
      [22.16900082250538,48.42756980917761]
    ] as [number, number][];

    const pointsLayer = L.layerGroup();

    points.forEach(point => {
      const pointMarker = L.marker([
        point[1],
        point[0]
      ], {
        icon: L.divIcon({
          className: 'shield-icon',
          html: shieldSvg,
          iconSize: [24, 24]
        })
      });
      // on hover event
      pointMarker.on('mouseover', (event: any) => {
        const targetElm = event.originalEvent.target;
        targetElm.classList.add('active');
        const boundingRect = targetElm.getBoundingClientRect();
        console.log('position: ', boundingRect);
        const mapDialog = document.getElementById('map-dialog') as HTMLElement;
        // set the dialog position
        mapDialog.style.top = `${boundingRect.top - 98}px`;
        mapDialog.style.left = `${boundingRect.left - mapDialog.offsetWidth / 2 + 12}px`;
      });
      pointMarker.on('mouseout', (event: any) => {
        // const targetElm = event.originalEvent.target;
        // targetElm.classList.remove('active');

        // const mapDialog = document.getElementById('map-dialog') as HTMLElement;
        // mapDialog.style.top = '-9999px';
        // mapDialog.style.left = '-9999px';
      });
      pointMarker.on('click', (event: any) => {
        // const mapDialog = document.getElementById('map-dialog') as HTMLElement;
        // mapDialog.classList.add('active');

        this.mapService.getWeather(point[1], point[0]).subscribe((data: any) => {
          console.log(data);
          // draw weather polygon on the map
          // const weatherLayer = L.geoJSON(data, {
          //   style: (feature: any) => {
          //     return {
          //       color: 'blue',
          //       weight: 2,
          //       opacity: 0.8
          //     };
          //   }
          // });

          // weatherLayer.addTo(this.map);

        });
      });
      pointMarker.addTo(pointsLayer);
    });

    pointsLayer.addTo(this.map);


    const londonPolygon = L.polygon([
      [51.5185, -0.1357],
      [51.5185, -0.1157],
      [51.4985, -0.1157],
      [51.4985, -0.1357]
    ], {
        color: 'blue',
        fillColor: '#blue',
        fillOpacity: 0.5
    }).addTo(this.map);
  }

  constructor(
    private mapService: MapService
  ) { }

  ngAfterViewInit(): void {
    this.initMap();
  }
}