import { Injectable } from '@angular/core';
import { NGXLogger as Logger } from 'ngx-logger';
import { ServiceLoader } from '@app/models/service.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements ServiceLoader {

  public canRequestPermission: boolean = false;

  constructor(
    private _logger: Logger,
  ) { }

  load() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
    // https://developers.google.com/web/fundamentals/push-notifications/display-a-notification
  }

  async requestPermission() {
    this._logger.log("Creating Notification");
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      this._logger.log("permission granted");
    }
  }
}
