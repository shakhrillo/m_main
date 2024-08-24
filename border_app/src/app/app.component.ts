import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from './services/map.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('iframeMap') iframeMap: ElementRef | undefined;

  constructor(private mapService: MapService) { }

  iframeBlob: any;
  iframeMapHeight: number = 0;
  
  ngOnInit(): void {
    this.mapService.getMap().subscribe((data: any) => {
      const url = URL.createObjectURL(data);
      this.iframeBlob = url;

      this.iframeMapHeight = window.innerHeight - 64;
    });
  }
  
}