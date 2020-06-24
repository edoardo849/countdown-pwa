import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from 'idb';
import { NGXLogger as Logger } from 'ngx-logger';
import { Event } from './event.model';
interface DB extends DBSchema {
  events: {
    value: Event;
    key: number;
    indexes: { 'by-date': Date };
  };
}
// https://mdbootstrap.com/education/pwa/angular/lesson-6-creating-indexeddb-database/
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  //TODO: implement data change
  private _dataChange: Subject<Event> = new Subject<Event>();
  private _db: IDBPDatabase<DB>;

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
        store.createIndex('by-date', 'date');
      }
    });
    this._db = storage;
  }

  async deleteEvent(eventId: number) {
    this._logger.debug("Deleting event", eventId);
    try {
      const result = await this._db.delete('events', eventId);
      this._logger.debug("Deleted", result);
    } catch (e) {
      this._logger.error("Could not delete the event", eventId, e);
    }
  }

  async putEvent(event: Event) {
    this._logger.debug("Saving event", event);
    try {
      const result = await this._db.put('events', event);
      this._logger.debug("Saved", result);
    } catch (e) {
      this._logger.error("Could not create the event", event, e);
    }
  }
}
