import { Component, OnInit } from '@angular/core';
import { StorageService } from '@app/storage.service';
import { CountdownEvent } from '@app/event.model';
import { NGXLogger as Logger } from 'ngx-logger';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {

  colours: any = [
    { label: 'Pink', value: '#E91E63' },
    { label: 'Purple', value: '#9C27B0' },
    { label: 'Blue', value: '#2196F3' },

    { label: 'Green', value: '#4CAF50' },
    { label: 'Yellow', value: '#FFC107' },

  ];

  model: CountdownEvent = new CountdownEvent();

  constructor(
    private _storageService: StorageService,
    private _logger: Logger,

  ) { }

  ngOnInit(): void {
  }

  async onSubmit(form: Event) {
    this.model.colour = form['colour'];
    this._logger.log("Form Submitted", this.model);
    try {
      const result = await this._storageService.putEvent({
        date: this.model.date,
        description: this.model.description,
        colour: this.model.colour,
      });
      this._logger.debug("Success", result);
      // TODO: close modal
    } catch (e) {
      this._logger.error("Could not create the event", e);
    }

  }

  async createEvent() {

  }
}
