/// <reference lib="webworker" />
import { timer } from 'rxjs';
import { openDB, IDBPDatabase } from 'idb/with-async-ittr';
import { DB } from './../models/db.model';
import * as moment from 'moment';

const canLog = true;
const canNotify = () => {
  if (
    ("Notification" in self) &&
    Notification.permission === "granted"
  ) {
    return true;
  }
  return false;
}
let _timerStarted = false;
let _db: IDBPDatabase<DB>;

addEventListener('message', async ({ data }) => {

  const response = `worker response to ${data}`;
});

const start = async () => {
  if (_timerStarted === false) {
    _db = await openDB<DB>('countdown-pwa', 1);
    postMessage('Storage opened');

    // perform the first load of active and expired events
    console.log("Starting the timer");
    // start the refresh timer at every minute
    timer(0, 60000).subscribe(async () => {
      refreshEvents();
    });
    _timerStarted = true;
    postMessage('Timer Started');
  } else {
    postMessage('Timer already running');
  }
}

start();

const refreshEvents = async () => {
  if (canLog) {
    console.log("refreshing events");
  }

  let changed = false;
  const index = _db.transaction("events", "readwrite").store.index("difference");
  for await (const cursor of index.iterate(IDBKeyRange.lowerBound(0, true), "next")) {
    const date = moment(cursor.value.date);
    const now = moment(new Date());
    const diff = date.diff(now);
    const event = { ...cursor.value };
    event.difference = diff;

    if (diff <= 0) {
      if (canLog) {
        console.log("an event expired");
      }
      cursor.update(event);
      changed = true;
      if (canNotify()) {
        if (canLog) {
          console.log("sending notification");
        }
        new Notification(`${event.description}`, {
          body: 'The countdown ended for this event',
          icon: './assets/icons/icon-512x512.png'
        });
      }
    }
    cursor.continue();
  }

  if (changed) {
    postMessage('triggerEventsChanged');
  }
}
