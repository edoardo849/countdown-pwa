import { DBSchema } from 'idb/with-async-ittr';
import { Event } from './event.model';

export interface DB extends DBSchema {
  events: {
    value: Event;
    key: number;
    indexes: { 'difference': number };
  };
}
