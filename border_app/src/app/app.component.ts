import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from './services/map.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('iframeMap') iframeMap: ElementRef | undefined;

  constructor(
    private mapService: MapService,
    public activatedRoute: ActivatedRoute
  ) { }

  iframeBlob: any;
  iframeMapHeight: number = 0;
  
  ngOnInit(): void {
    const query = new URLSearchParams({
      start: '[55.7558, 37.6176]',
      end: '[41.0082, 28.9784]',
    }).toString();

    // this.mapService.getMap(
    //   query
    // ).subscribe((data: any) => {
    //   const url = URL.createObjectURL(data);
    //   this.iframeBlob = url;

    //   this.iframeMapHeight = window.innerHeight - 64;
    // });

    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      if (params['start'] || params['end']) {
        const query = new URLSearchParams({
          start: params['start'] || '[55.7558, 37.6176]',
          end: params['end'] || '[41.0082, 28.9784]',
          through: params['through'] || '',
        }).toString();

        this.mapService.getMap(
          query
        ).subscribe((data: any) => {
          const url = URL.createObjectURL(data);
          this.iframeBlob = url;

          this.iframeMapHeight = window.innerHeight - 64;
        });
      }
    });
  }
  
}