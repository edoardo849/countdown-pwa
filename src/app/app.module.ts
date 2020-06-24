import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
    BrowserModule,
    AppRoutingModule,
    LoggerModule.forRoot({
      level: environment.loggerLevel,
      enableSourceMaps: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
