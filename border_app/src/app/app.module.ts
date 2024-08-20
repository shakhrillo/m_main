import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { SafeUrlPipe } from './pipes/safe';

@NgModule({
  declarations: [
    SafeUrlPipe,
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
  ],
  providers: [
    provideHttpClient(),
    // provideHttpClient(withInterceptorsFor([{
    //   provide: HTTP_INTERCEPTORS,
    //   // useClass: () => {},
    //   multi: true
    // }])),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
function withInterceptorsFor(arg0: { provide: import("@angular/core").InjectionToken<readonly import("@angular/common/http").HttpInterceptor[]>; useClass: any; multi: boolean; }[]): import("@angular/common/http").HttpFeature<import("@angular/common/http").HttpFeatureKind>
{
  throw new Error('Function not implemented.');
}

