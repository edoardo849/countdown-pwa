export interface Event {
  date: Date
  description: string
  colour: string
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
