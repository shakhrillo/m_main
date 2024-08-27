import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from './services/map.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

declare var map: any;
declare var L: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('iframeMap') iframeMap: ElementRef | undefined;

  public crossPoints: any[] = [];

  private clickSubject = new Subject<any>();

  constructor(
    private mapService: MapService,
    public activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.mapService.mapCrossPoints$.subscribe((crossPoints) => {
      console.log(crossPoints);
      this.crossPoints = crossPoints;
    });
  }

  iframeBlob = {
    url: '',
    subject: new Subject<string>(),
  }
  iframeMapHeight: number = 0;
  
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['start'] || params['end']) {
        const query = new URLSearchParams({
          start: params['start'] || '[55.7558, 37.6176]',
          end: params['end'] || '[41.0082, 28.9784]',
          through: params['through'] || '[]',
        }).toString();

        this.mapService.getMap(
          query
        ).subscribe((data: any) => {
          console.log(data);
          const url = URL.createObjectURL(data);
          this.iframeBlob['url'] = url;

          this.iframeMapHeight = window.innerHeight - 64;

          const iframeMap = this.iframeMap?.nativeElement;
          iframeMap.contentWindow.location.reload(true);
        });
      }
    });

    this.clickSubject.pipe(debounceTime(100)).subscribe(e => {
      const throughs = JSON.parse(this.activatedRoute.snapshot.queryParams['through'] || '[]');
      console.log([e.latlng.lng, e.latlng.lat])
      throughs.push([e.latlng.lng, e.latlng.lat]);
      this.router.navigate([], {
        queryParams: {
          through: JSON.stringify([[e.latlng.lng, e.latlng.lat]])
        },
        queryParamsHandling: 'merge'
      });
    });
  }

  ngAfterViewInit(): void {
    const iframeMap = this.iframeMap?.nativeElement;
    iframeMap.onload = () => {
      const foliumMap = iframeMap.contentWindow?.document.getElementsByClassName('folium-map');
      if (foliumMap.length) {
        console.log('ready');
        const foliumMapId = foliumMap[0]['id'];
        (window as any).map = iframeMap.contentWindow.window[foliumMapId];
        (window as any).map_cross_points = iframeMap.contentWindow.window.map_cross_points;
        (window as any).L = iframeMap.contentWindow.window.L;

        this.mapService.mapCrossPoints$.next((window as any).map_cross_points);

        const allLayers = map._layers;
        for (let layer in allLayers) {
          if (allLayers[layer].options && allLayers[layer].options.pane === 'overlayPane') {
            const pointLayer = allLayers[layer];
            if (pointLayer._path) {
              pointLayer.on('click', (e: any) => {
                this.clickSubject.next(e);
              });
            }
          }
        }

        map.on("boxzoomend", (e: any) => {


          const mapBounds = e.boxZoomBounds;
          const allMarkers = Object.values(map._layers);
          const markers = allMarkers.filter((layer: any) => {
            return layer.getLatLng && layer.options &&
                   layer.options.pane === 'overlayPane' &&
                   mapBounds.contains(layer.getLatLng());
          });

          // middle of the celected points and draw circle
          const latLngs = markers.map((marker: any) => marker.getLatLng());
          function createBoundingBoxFromPoints(points: { lat: number, lng: number }[]) {
            // Get latitude and longitude arrays
            const lats = points.map(point => point.lat);
            const lngs = points.map(point => point.lng);
            
            // Find the min and max latitudes and longitudes
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            const minLng = Math.min(...lngs);
            const maxLng = Math.max(...lngs);
            
            // Calculate original bounding box width and height
            const originalHeight = maxLat - minLat;
            const originalWidth = maxLng - minLng;
            
            // Approximate conversion factor from kilometers to degrees latitude
            const kmToLatDegrees = 1 / 111; // Roughly 1 degree latitude ~ 111 km
            
            // Radius in kilometers
            const radiusKm = 1;
            
            // Calculate the radius in degrees
            const radiusLatDegrees = radiusKm * kmToLatDegrees;
            
            // To calculate the longitude degree offset, adjust for latitude
            // Average latitude in radians
            const avgLatRadians = ((minLat + maxLat) / 2) * (Math.PI / 180);
            // Distance per degree of longitude in meters
            const metersPerDegreeLongitude = 111000 * Math.cos(avgLatRadians);
            // Convert 5km to degrees of longitude
            const radiusLngDegrees = radiusKm / metersPerDegreeLongitude;
            
            // Determine the larger dimension to ensure a square bounding box
            const maxDimensionDegrees = Math.max(originalWidth, originalHeight);
            
            // Calculate the additional buffer needed to make the bounding box square
            const additionalBufferDegrees = maxDimensionDegrees / 2 + radiusLatDegrees;
            
            // Expand the bounding box to ensure it is square
            const expandedMinLat = minLat - additionalBufferDegrees;
            const expandedMaxLat = maxLat + additionalBufferDegrees;
            const expandedMinLng = minLng - additionalBufferDegrees;
            const expandedMaxLng = maxLng + additionalBufferDegrees;
        
            return [
                [expandedMinLat, expandedMinLng],
                [expandedMaxLat, expandedMinLng],
                [expandedMaxLat, expandedMaxLng],
                [expandedMinLat, expandedMaxLng],
            ];
          }
        
          const boundingBox = createBoundingBoxFromPoints(latLngs);
          // draw bounding box
          const polygon = L.polygon(boundingBox, {color: 'red'}).addTo(map);

          this.mapService.saveGeoJSONBBOX({
            boundingBox,
          }).subscribe((data) => {
            console.log(data);
          });

          // const center = [(boundingBox[0][0] + boundingBox[2][0]) / 2, (boundingBox[0][1] + boundingBox[2][1]) / 2];


          // const latLngsLength = latLngs.length;
          // const latSum = latLngs.reduce((acc: number, latLng: any) => acc + latLng.lat, 0);
          // const lngSum = latLngs.reduce((acc: number, latLng: any) => acc + latLng.lng, 0);
          // const lat = latSum / latLngsLength;
          // const lng = lngSum / latLngsLength;
          // const center = [lat, lng] as any;
          // const radius = 0.1;
          // const circle = L.circle(center, {
          //   color: 'red',
          //   fillColor: '#f03',
          //   fillOpacity: 0.5,
          //   radius: radius * 1000,
          // }).addTo(map);


          // this.mapService.saveGeoJSON({
          //   latitude: lat,
          //   longitude: lng,
          // }).subscribe((data) => {
          //   console.log(data);
          // });
        
          console.log(markers);
        });

        const allPins = Object.values(map._layers).filter((layer: any) => {
          return layer.options && layer.options.id === 'point';
        }) as any;

        console.log(allPins);

        for (let pin of allPins) {
          pin.on('click', (e: any) => {
            console.log(e);
            const countryName = e.target.options.title;
          });
        }


      }
    };
  }
  
}