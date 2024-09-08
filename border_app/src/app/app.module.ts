import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DirectionsFilterFormComponent } from './components/directions-filter-form/directions-filter-form.component';
import { SafeUrlPipe } from './pipes/safe';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

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
    provideFirebaseApp(() => initializeApp({"projectId":"borderline-dev","appId":"1:406001897389:web:bcf2d6fd7ea1b69c749b24","storageBucket":"borderline-dev.appspot.com","apiKey":"AIzaSyAbWEKCv0vFuretjZhtxrrXBHKgTOy-7cE","authDomain":"borderline-dev.firebaseapp.com","messagingSenderId":"406001897389","measurementId":"G-YJ9H91CHK1"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
