import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, timer } from 'rxjs';
import { openDB, IDBPDatabase } from 'idb/with-async-ittr';
import { NGXLogger as Logger } from 'ngx-logger';
import { Event, Status } from '@app/models/event.model';
import { DB } from '@app/models/db.model';
import * as moment from 'moment';
import { ServiceLoader } from '@app/models/service.model';
// https://mdbootstrap.com/education/pwa/angular/lesson-6-creating-indexeddb-database/
@Injectable({
  providedIn: 'root'
})
export class StorageService implements ServiceLoader {

  public events$: Observable<Event[]>;
  public expiredEvents$: Observable<Event[]>;

  //TODO: implement data change
  private _eventsDataChange: BehaviorSubject<Event[]>;
  private _expiredEventsDataChange: BehaviorSubject<Event[]>;

  private _db: IDBPDatabase<DB>;

  private _timerStarted: boolean = false;
  private _worker: Worker = null;

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

    if (typeof Worker !== 'undefined') {
      // Create a new
      this._worker = new Worker('./storage.worker', { type: 'module' });

      this._worker.onmessage = async ({ data }) => {
        this._logger.log(`SW: `, data);

        if (data === 'triggerEventsChanged') {
          this._logger.log("Triggering events changed");
          await this._triggerExpiredEventsChanged();
          await this._triggerEventsChanged();
        }
      };

    } else {
      this._logger.warn("SW not supported");
    }

    if (this._timerStarted === false) {

      // start the refresh timer at every minute
      this._refreshTimer = timer(1000, 60000).subscribe(async () => {
        this._logger.debug("Refreshing active events: ");
        await this._triggerEventsChanged();
      });
      this._timerStarted = true;
    }
    // perform first load
    await this._triggerExpiredEventsChanged();
    await this._triggerEventsChanged();

    this._logger.debug('Done');
  }

  getAllEvents(filter?: Status) {
    if (filter && filter === Status.EXPIRED) {
      return this.expiredEvents$;
    }
    return this.events$;
  }

  async getAllExpiredEvents() {
    return this.expiredEvents$;
  }

  private async _triggerExpiredEventsChanged() {
    const events = await this._db.getAllFromIndex('events', 'difference', IDBKeyRange.upperBound(0, true));
    this._logger.debug("Retrieved expired events", events);
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
      await this._triggerExpiredEventsChanged();

    } catch (e) {
      this._logger.error("Could not create the event", event, e);
    }
  }

  private async _triggerEventsChanged() {
    try {
      this._logger.debug('Getting all events from the index');

      const events: Event[] = [];
      const index = this._db.transaction("events", "readonly").store.index("difference");

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
        }
        cursor.continue();
      }

      this._logger.debug('Retrieved active events', events);
      this._eventsDataChange.next(events);

    } catch (e) {
      this._logger.error("Failed to get events from DB index", e);
    }

  }
}
