import { Component, OnInit, Input } from '@angular/core';
import { Event } from '@app/models/event.model';
import { NGXLogger as Logger } from 'ngx-logger';
import { StorageService } from '@app/storage.service';

@Component({
  selector: 'app-countdown-item',
  templateUrl: './countdown-item.component.html',
  styleUrls: ['./countdown-item.component.scss']
})
export class CountdownItemComponent implements OnInit {

  @Input() event: Event;

  constructor(
    private _logger: Logger,
    private _storageService: StorageService,
  ) { }

  ngOnInit(): void {
  }

  async delete(key: number) {
    this._logger.log("Removing item #", key);

    try {
      await this._storageService.deleteEvent(key);
    } catch (e) {
      this._logger.error("Could not delete item #", key);
    }
  }

}
