import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { NGXLogger as Logger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

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
}
