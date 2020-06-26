import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PwaService } from './pwa.service';
import { NGXLogger as Logger } from 'ngx-logger';
import { EventManager } from '@angular/platform-browser';

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

  ) { }

  ngOnInit() {

    this._eventManager.addGlobalEventListener('window', 'appinstalled', () => {
      this._logger.info("The app was installed");
    });

    this._eventManager.addGlobalEventListener('window', 'beforeinstallprompt', $event => {
      this._logger.log("Before install event fired");
      $event.preventDefault();

      this._pwaService.promptEvent = $event;
    });

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
        window.screen.availHeight / 2
      );
    }
    // Log launch display mode to analytics
    this._logger.info('DISPLAY_MODE_LAUNCH:', displayMode);
  }

}
