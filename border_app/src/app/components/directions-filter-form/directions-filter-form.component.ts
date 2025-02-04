import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-directions-filter-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './directions-filter-form.component.html',
  styleUrl: './directions-filter-form.component.scss'
})
export class DirectionsFilterFormComponent implements OnInit {
  startingPoint: string = 'Moscow';
  endingPoint: string = 'Istanbul';
  throughPoint: string = '';

  throughPoints = [] as any;

  public countries: [] = [] as any;
  private _countries: [] = [] as any;
  
  constructor(
    private mapService: MapService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mapService.getCountries().subscribe((data: any) => {
      this._countries = data['features'];
      
      const queryParams = this.router.parseUrl(this.router.url).queryParams;
      if (queryParams['start']) {
        const start = JSON.parse(queryParams['start']);
        this.startingPoint = data['features'].find((country: any) => {
          return country['geometry']['coordinates'][0] === start[0] && country['geometry']['coordinates'][1] === start[1];
        })['properties']['country'];
      }

      if (queryParams['end']) {
        const end = JSON.parse(queryParams['end']);
        this.endingPoint = data['features'].find((country: any) => {
          return country['geometry']['coordinates'][0] === end[0] && country['geometry']['coordinates'][1] === end[1];
        })['properties']['country'];
      }

      if (queryParams['through']) {
        const through = JSON.parse(queryParams['through']);
        this.throughPoints = data['features'].filter((country: any) => {
          return through.some((point: any) => {
            return country['geometry']['coordinates'][0] === point[0] && country['geometry']['coordinates'][1] === point[1];
          });
        });

        this.throughPoints.forEach((point: any) => {
          through.splice(through.findIndex((p: any) => {
            return p[0] === point['geometry']['coordinates'][0] && p[1] === point['geometry']['coordinates'][1];
          }), 1);
        });

        this.throughPoints = [
          ...this.throughPoints,
          ...through.map((point: any) => {
            return {
              'geometry': {
                'coordinates': point
              },
              'properties': {
                'country': 'Through point',
                'city': 'Unknown',
                'tld': 'Unknown',
                'iso3': 'Unknown',
                'iso2': 'Unknown'
              }
            }
          })
        ]
      }

    });
  }

  onStartingPointChange(value: string = '') {
    this.countries = this._countries.filter((country: any) => {
      let countryName = country['properties']['country'].toLowerCase();
      let cityName = country['properties']['city'] || '';
      let tld = country['properties']['tld'] || '';
      let iso3 = country['properties']['iso3'] || '';
      let iso2 = country['properties']['iso2'] || '';
      if (cityName) {
        cityName = cityName.toLowerCase();
      }
      if (tld) {
        tld = tld.toLowerCase();
      }
      if (iso3) {
        iso3 = iso3.toLowerCase();
      }
      if (iso2) {
        iso2 = iso2.toLowerCase();
      }
      return countryName.includes(value.toLowerCase()) || cityName.includes(value.toLowerCase());
    }) as any;
  }

  onEndingPointChange(value: string = '') {
    this.countries = this._countries.filter((country: any) => {
      let countryName = country['properties']['country'].toLowerCase();
      let cityName = country['properties']['city'] || '';
      let tld = country['properties']['tld'] || '';
      let iso3 = country['properties']['iso3'] || '';
      let iso2 = country['properties']['iso2'] || '';
      if (cityName) {
        cityName = cityName.toLowerCase();
      }
      if (tld) {
        tld = tld.toLowerCase();
      }
      if (iso3) {
        iso3 = iso3.toLowerCase();
      }
      if (iso2) {
        iso2 = iso2.toLowerCase();
      }
      return countryName.includes(value.toLowerCase()) || cityName.includes(value.toLowerCase());
    }) as any;
  }

  onThroughPointChange(value: string = '') {
    this.countries = this._countries.filter((country: any) => {
      let countryName = country['properties']['country'].toLowerCase();
      let cityName = country['properties']['city'] || '';
      let tld = country['properties']['tld'] || '';
      let iso3 = country['properties']['iso3'] || '';
      let iso2 = country['properties']['iso2'] || '';
      if (cityName) {
        cityName = cityName.toLowerCase();
      }
      if (tld) {
        tld = tld.toLowerCase();
      }
      if (iso3) {
        iso3 = iso3.toLowerCase();
      }
      if (iso2) {
        iso2 = iso2.toLowerCase();
      }
      return countryName.includes(value.toLowerCase()) || cityName.includes(value.toLowerCase());
    }) as any;
  }

  startingPointChange(country: any) {
    this.startingPoint = country['properties']['country'];
    // change URL query params
    this.router.navigate([], {
      queryParams: {
        start: JSON.stringify(country['geometry']['coordinates'])
      },
      queryParamsHandling: 'merge'
    });
  }

  endingPointChange(country: any) {
    this.endingPoint = country['properties']['country'];
    // change URL query params
    this.router.navigate([], {
      queryParams: {
        end: JSON.stringify(country['geometry']['coordinates'])
      },
      queryParamsHandling: 'merge'
    });
  }

  throughPointChange(country: any) {
    this.throughPoints.push(country);
    const coordinates = this.throughPoints.map((country: any) => country['geometry']['coordinates'])

    // change URL query params
    this.router.navigate([], {
      queryParams: {
        through: JSON.stringify(coordinates)
      },
      queryParamsHandling: 'merge'
    });
  }

  removeThroughPoint(country: any) {
    this.throughPoints = this.throughPoints.filter((point: any) => {
      return point['properties']['country'] !== country['properties']['country'];
    });

    const coordinates = this.throughPoints.map((country: any) => country['geometry']['coordinates'])

    // change URL query params
    this.router.navigate([], {
      queryParams: {
        through: JSON.stringify(coordinates)
      },
      queryParamsHandling: 'merge'
    });
  }

  moveThroughPointUp(index: number) {
    if (index > 0) {
      const temp = this.throughPoints[index];
      this.throughPoints[index] = this.throughPoints[index - 1];
      this.throughPoints[index - 1] = temp;

      const coordinates = this.throughPoints.map((country: any) => country['geometry']['coordinates'])

      // change URL query params
      this.router.navigate([], {
        queryParams: {
          through: JSON.stringify(coordinates)
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  moveThroughPointDown(index: number) {
    if (index < this.throughPoints.length - 1) {
      const temp = this.throughPoints[index];
      this.throughPoints[index] = this.throughPoints[index + 1];
      this.throughPoints[index + 1] = temp;

      const coordinates = this.throughPoints.map((country: any) => country['geometry']['coordinates'])

      // change URL query params
      this.router.navigate([], {
        queryParams: {
          through: JSON.stringify(coordinates)
        },
        queryParamsHandling: 'merge'
      });
    }
  }
}
