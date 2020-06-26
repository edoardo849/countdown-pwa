import { Injectable, HostListener } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { NGXLogger as Logger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class PwaService {

  public promptEvent: any = null;
  // https://web.dev/customize-install/


  constructor(
    private _swUpdate: SwUpdate,
    private _logger: Logger,

  ) {

    if (!this._swUpdate.isEnabled) {
      this._logger.warn("SwUpdate is disabled");
      return
    }

    this._swUpdate.available.subscribe(() => {
      if (confirm("New version available. Load New Version?")) {
        window.location.reload();
      }
    });

  }

  install() {
    this._logger.log("Attempting to install the app");
    this.promptEvent.prompt();

    this.promptEvent.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        this._logger.info('User accepted the install prompt');
        this.promptEvent = null;
      } else {
        this._logger.warn('User dismissed the install prompt');
      }
    })
  }
}
