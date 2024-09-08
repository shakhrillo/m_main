import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MapService {

  mapCrossPoints$ = new Subject<any>();

  constructor(private http: HttpClient) { }

  getMap(query: string): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrl}/map?${query}`, { responseType: 'blob' as 'json' });
  }

  getCountries(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/countries`);
  }

  getDirections(start: string, end: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/directions?start=${start}&end=${end}`);
  }

  saveGeoJSON(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/save-geojson`, data);
  }

  saveGeoJSONBBOX(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/save-bbox`, data);
  }

  getWeather(lat: number, lon: number): Observable<any> {
    // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat: lat.toString(),
        lon: lon.toString(),
        appid: 'fc61665737d2e0ceb93f78e7188d861f'
      }
    });
  }
}
