export interface Event {
  date: Date;
  description: string;
  colour: string;
  countdown?: Countdown;
  difference?: number;
  readonly key?: number;
}

export enum Status {
  EXPIRED = 'expired',
  NOT_EXPIRED = 'not-expired'
}

export interface Countdown {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
}

export class CountdownEvent implements Event {

  public description: string;
  public colour: string;
  public utcDate: string;

  constructor() { }

  get date(): Date {
    if (this.utcDate) {
      return new Date(`${this.utcDate}Z`);
    }
    return null;
  }

}
