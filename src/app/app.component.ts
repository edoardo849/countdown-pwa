import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PwaService } from '@app/services/pwa.service';
import { NGXLogger as Logger } from 'ngx-logger';
import { EventManager } from '@angular/platform-browser';
import { AnalyticsService } from '@app/services/analytics.service';
import { NotificationService } from '@app/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'countdown';

  constructor(
    private _pwaService: PwaService,
    private _logger: Logger,
    private _eventManager: EventManager,
    private _analyticsService: AnalyticsService,
    private _notificationService: NotificationService

  ) { }

  ngOnInit() {

    this._eventManager.addGlobalEventListener('window', 'appinstalled', () => {
      this._logger.info("The app was installed");
      this._analyticsService.recordEvent({
        name: 'pwaInstalled',
      });
    });

    this._eventManager.addGlobalEventListener('window', 'beforeinstallprompt', $event => {
      this._logger.log("Before install event fired");
      $event.preventDefault();
      this._pwaService.promptEvent = $event;
    });

    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission !== "denied" && Notification.permission !== "granted") {
      this._notificationService.canRequestPermission = true;
    }
  }

  ngAfterViewInit() {
    this._logger.info("The DOM was loaded");
    let displayMode = 'browser tab';
    if (window.navigator['standalone']) {
      displayMode = 'standalone-ios';
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {

      displayMode = 'standalone';
      // Resize Window
      window.resizeTo(
        400,
        window.screen.availHeight
      );
    }
    // Log launch display mode to analytics
    this._logger.info('DISPLAY_MODE_LAUNCH:', displayMode);
    this._analyticsService.recordEvent({
      name: 'displayType',
      attributes: {
        displayModeLaunch: displayMode
      }
    });
  }

}
