import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from './services/map.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

declare var map: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('iframeMap') iframeMap: ElementRef | undefined;

  private clickSubject = new Subject<any>();

  constructor(
    private mapService: MapService,
    public activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

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
      throughs.push([e.latlng.lng, e.latlng.lat]);
      this.router.navigate([], {
        queryParams: {
          through: JSON.stringify(throughs)
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
      }
    };
  }
  
}