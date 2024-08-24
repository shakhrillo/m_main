import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }

  getMap(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrl}/map`, { responseType: 'blob' as 'json' });
  }
}
