import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { LoggerModule } from 'ngx-logger';
import { environment } from '@src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CountdownListComponent } from './countdown-list/countdown-list.component';
import { CountdownItemComponent } from './countdown-item/countdown-item.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { ModalComponent } from './modal/modal.component';
import { HttpClientModule } from '@angular/common/http';
import { StorageService } from './storage.service';
import { FormsModule } from '@angular/forms';
import localeGb from '@angular/common/locales/en-GB';
import { registerLocaleData } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';

registerLocaleData(localeGb);

export function appInit(storageService: StorageService) {
  return () => storageService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CountdownListComponent,
    CountdownItemComponent,
    EventCreateComponent,
    ModalComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    LoggerModule.forRoot({
      level: environment.loggerLevel,
      enableSourceMaps: true,
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [

    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [StorageService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
