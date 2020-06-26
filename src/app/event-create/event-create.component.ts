import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '@app/storage.service';
import { CountdownEvent } from '@app/models/event.model';
import { NGXLogger as Logger } from 'ngx-logger';
import { NgForm } from '@angular/forms';

import { COLOURS, Colour } from "@app/models/colour.model";
import { ModalComponent } from '@app/modal/modal.component';
import { AnalyticsService } from '@app/analytics.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {

  @ViewChild('modal') modal: ModalComponent;

  colours: Colour[] = COLOURS;
  model: CountdownEvent = new CountdownEvent();

  constructor(
    private _storageService: StorageService,
    private _logger: Logger,
    private _analyticsService: AnalyticsService,
  ) { }

  ngOnInit(): void {
  }

  async onSubmit(form: Event) {
    this.model.colour = form['colour'];
    this._logger.log("Form Submitted", this.model);
    try {
      const event = {
        date: this.model.date,
        description: this.model.description,
        colour: this.model.colour,
      };
      const result = await this._storageService.putEvent(event);

      this._logger.debug("Event created", result);

      this._analyticsService.recordEvent({
        name: 'eventCreated',
        attributes: event
      });

      await this.modal.closeModal();

    } catch (e) {
      this._logger.error("Could not create the event", e);
    }
  }
}
