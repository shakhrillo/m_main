import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DirectionsFilterFormComponent } from './components/directions-filter-form/directions-filter-form.component';
import { SafeUrlPipe } from './pipes/safe';

@NgModule({
  declarations: [
    SafeUrlPipe,
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    LeafletModule,
    DirectionsFilterFormComponent
  ],
  providers: [
    provideHttpClient(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
