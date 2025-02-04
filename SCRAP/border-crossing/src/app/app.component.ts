import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Components
import { BorderInfoComponent } from './components/border-info/border-info.component';
import { HttpClient } from '@angular/common/http';
import { m_g_bc } from './data/mexico_gtl';

declare var L: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BorderInfoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [HttpClient]
})
export class AppComponent implements OnInit {
  title = 'border-crossing';

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    var map = L.map('map');

    // central america
    map.setView([
      15.7835,
      -90.2308
    ], 6);

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(map);

    // Add a border
    var border = L.geoJSON();
    border.addTo(map);
    
    this.http.get('https://data.bts.gov/views/keg4-3bc2/rows.json?accessType=DOWNLOAD')
      .subscribe(({data}: any) => {
        const duplicates: any = {}
        let count = 0;

        data = data
        .filter((row: any) => {
          const borderWith = row[11];
          return borderWith === 'US-Mexico Border';
        });

        const startLatAndLon = [
          data[0][15],
          data[0][16]
        ];

        const endLatAndLon = [
          data[
            data.length - 1
          ][15],
          data[
            data.length - 1
          ][16]
        ];

        const bounds = L.latLngBounds(
          startLatAndLon,
          endLatAndLon
        );

        map.fitBounds(bounds);

        map.zoomOut(1);

        data.forEach((row: any) => {
          var lat = row[15];
          var lon = row[16];
          var location = row[
            11
          ];
          
          if (duplicates[lat + '_' + lon]) {
            return;
          } else {
            count += 1;
            duplicates[lat + '_' + lon] = true;
          }

          if (lat && lon) {
            // L.marker([lat, lon]).addTo(map)
            // .bindPopup(location);
            const circle = L.circle([lat, lon], {
              color: 'red',
              fillColor: '#f03',
              fillOpacity: 0.5,
              // radius: 5000
              
            }).addTo(map);

            L.circle([lat, lon], {
              color: 'red',
              fillColor: '#f03',
              fillOpacity: 0.5,
              radius: 5000
              // radius: 50000
            }).addTo(map);

            circle.bindPopup(location);
          }

        });

      });


      // Mexico Guatemala Border
      m_g_bc.forEach((border: any) => {
        // circle
        L.circle([border.mexico.lat, border.mexico.lng], {
          color: 'blue',
          fillColor: '#f03',
          fillOpacity: 0.5,
        }).addTo(map);
      });
  }
}
