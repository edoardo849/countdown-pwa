import { Injectable } from '@angular/core';
import { Analytics } from '@aws-amplify/analytics';
import { environment } from '@src/environments/environment';
import { NGXLogger as Logger } from 'ngx-logger';


interface AmplifyMetrics {
  name: string
  attributes?: object
  metrics?: {
    [key: string]: number;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    private _logger: Logger,
  ) { }

  async recordEvent(m: AmplifyMetrics) {
    this._logger.log("Recording event", m);

    if (environment.production === false) {
      // https://docs.amplify.aws/lib/analytics/record/q/platform/js
      this._logger.warn("Analytics disabled");
      return
    }
    await Analytics.record(m);
  }
}
