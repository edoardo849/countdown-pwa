import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer, Subscription } from 'rxjs';
import { openDB, IDBPDatabase, DBSchema } from 'idb/with-async-ittr';
import { NGXLogger as Logger } from 'ngx-logger';
import { Event } from '@app/models/event.model';
import * as moment from 'moment';
interface DB extends DBSchema {
  events: {
    value: Event;
    key: number;
    indexes: { 'difference': number };
  };
}
// https://mdbootstrap.com/education/pwa/angular/lesson-6-creating-indexeddb-database/
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public events$: Observable<Event[]>;
  public expiredEvents$: Observable<Event[]>;

  //TODO: implement data change
  private _eventsDataChange: BehaviorSubject<Event[]>;
  private _expiredEventsDataChange: BehaviorSubject<Event[]>;

  private _db: IDBPDatabase<DB>;

  private _timerStarted: boolean = false;

  private _refreshTimer: Subscription;

  constructor(
    private _logger: Logger,
  ) { }

  async load() {
    this._logger.debug('Opening the DB connection');
    const logger = this._logger;
    const storage = await openDB<DB>('countdown-pwa', 1, {
      upgrade(db, oldVersion, newVersion, transaction) {

        logger.log(`Old Version: ${oldVersion}, New version: ${newVersion}`);

        const store = db.createObjectStore('events', {
          keyPath: 'key',
          autoIncrement: true,
        });

        store.createIndex('difference', 'difference');
      }
    });
    this._db = storage;

    this._eventsDataChange = new BehaviorSubject<Event[]>(null);
    this.events$ = this._eventsDataChange.asObservable();

    this._expiredEventsDataChange = new BehaviorSubject<Event[]>(null);
    this.expiredEvents$ = this._expiredEventsDataChange.asObservable();

    this._logger.debug('Done');
  }

  async getAllEvents() {

    await this._triggerEventsChanged();
    if (this._timerStarted === false) {
      this._logger.debug("Starting the timer");
      // start the refresh timer at every minute
      this._refreshTimer = timer(60000, 60000).subscribe(async () => {
        this._logger.debug("Refreshing the events");
        await this._triggerEventsChanged();
      });
      this._timerStarted = true;
    }

    return this.events$;
  }

  async getAllExpiredEvents() {

    if (this._timerStarted === true) {
      this._logger.debug("Stopping the timer");
      this._refreshTimer.unsubscribe();
      this._timerStarted = false;
    }

    await this._triggerExpiredEventsChanged();



    return this.expiredEvents$;
  }

  private async _triggerExpiredEventsChanged() {
    const events = await this._db.getAllFromIndex('events', 'difference', IDBKeyRange.upperBound(0, true));
    this._expiredEventsDataChange.next(events);
  }


  async deleteEvent(eventId: number) {
    this._logger.debug("Deleting event", eventId);
    try {
      const result = await this._db.delete('events', eventId);
      this._logger.debug("Deleted", result);

      await this._triggerEventsChanged();
      await this._triggerExpiredEventsChanged();

    } catch (e) {
      this._logger.error("Could not delete the event", eventId, e);
    }
  }

  async putEvent(event: Event) {
    this._logger.debug("Saving event", event);

    const date = moment(event.date);
    const now = moment(new Date());
    event.difference = date.diff(now);

    try {
      const result = await this._db.put('events', event);
      this._logger.debug("Saved", result);

      await this._triggerEventsChanged();

    } catch (e) {
      this._logger.error("Could not create the event", event, e);
    }
  }

  private async _triggerEventsChanged() {
    // TODO: sorting
    try {
      this._logger.debug('Getting all events from the index');

      const events: Event[] = [];
      const index = this._db.transaction("events", "readwrite").store.index("difference");

      for await (const cursor of index.iterate(IDBKeyRange.lowerBound(0, true), "next")) {

        this._logger.debug('Cursor: ', cursor.key, cursor.value);
        const date = moment(cursor.value.date);
        const now = moment(new Date());
        // https://momentjs.com/docs/#/displaying/difference/
        const diff = date.diff(now);
        const event = { ...cursor.value };

        event.difference = diff;
        if (diff > 0) {
          const countdown = {
            years: moment.duration(diff).years(),
            months: moment.duration(diff).months(),
            weeks: moment.duration(diff).weeks(),
            days: moment.duration(diff).days(),
            hours: moment.duration(diff).hours(),
            minutes: moment.duration(diff).minutes(),
          }

          event.countdown = countdown;
          events.push(event);
        } else {
          // Update the event only when it occurs in the past
          // let's not waste writes if there is no value in
          // updating all the events
          cursor.update(event);
        }
        cursor.continue();
      }

      this._logger.debug('Retrieved', events);
      this._eventsDataChange.next(events);

    } catch (e) {
      this._logger.error("Failed to get events from DB index", e);
    }

  }
}
