import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  geoJsonUrl = 'http://127.0.0.1:8000/entries';

  @ViewChild('iframeMap') iframeMap: ElementRef | undefined;

  constructor(private http: HttpClient) { }

  iframeBlob: any;
  iframeMapHeight: number = 0;
  
  ngOnInit(): void {
    const api_url = 'http://127.0.0.1:5000';

    this.http.get(`${api_url}/components`, {
      responseType: 'blob'
    }).subscribe((data: any) => {
      const url = URL.createObjectURL(data);
      this.iframeBlob = url;

      this.iframeMapHeight = window.innerHeight - 64;
    });
  }

  ngAfterViewInit(): void {
  }
}