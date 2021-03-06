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
import { StorageService } from '@app/services/storage.service';
import { FormsModule } from '@angular/forms';
import localeGb from '@angular/common/locales/en-GB';
import { registerLocaleData } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LayoutModule } from '@angular/cdk/layout';
import { ServiceLoader } from "@app/models/service.model";
import { NotificationService } from './services/notification.service';

registerLocaleData(localeGb);

export function serviceInit(service: ServiceLoader) {
  return () => service.load();
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
    LayoutModule,
  ],
  providers: [
    { provide: Window, useValue: window },
    {
      provide: APP_INITIALIZER,
      useFactory: serviceInit,
      multi: true,
      deps: [StorageService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: serviceInit,
      multi: true,
      deps: [NotificationService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
