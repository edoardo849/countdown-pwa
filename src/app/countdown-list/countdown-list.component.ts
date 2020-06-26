import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { StorageService } from '@app/storage.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Event } from '@app/models/event.model';
import { NGXLogger as Logger } from 'ngx-logger';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-countdown-list',
  templateUrl: './countdown-list.component.html',
  styleUrls: ['./countdown-list.component.scss']
})
export class CountdownListComponent implements OnInit, AfterContentInit, OnDestroy {

  public filterActiveEvents: boolean = true;

  public events$: Observable<Event[]>;
  public expiredEvents$: Observable<Event[]>;

  public title$: Observable<string>;
  private _titleSubject: BehaviorSubject<string>;

  private _routerSub: Subscription;

  constructor(
    private _storageService: StorageService,
    private _logger: Logger,

    private _router: ActivatedRoute,
  ) {
    this._titleSubject = new BehaviorSubject(null);
    this.title$ = this._titleSubject.asObservable();
  }

  async ngOnInit() {
    this._logger.log('Loading events');

    const activeEvents = await this._storageService.getAllEvents();
    this.events$ = activeEvents.pipe(
      filter((events => events !== null)),
      tap(events => this._logger.debug('Active Events loaded', events))
    );

    const expiredEvents = await this._storageService.getAllExpiredEvents();
    this.expiredEvents$ = expiredEvents.pipe(
      filter((events => events !== null)),
      tap(events => this._logger.debug('Expired Events loaded', events))
    );
  }

  async ngAfterContentInit() {
    this._router.queryParamMap.subscribe(params => {
      if (params.get('events') === 'expired') {
        this._logger.debug('Filtering expired events');
        this.filterActiveEvents = false;
      } else {
        this._logger.debug('Filtering active events');
        this.filterActiveEvents = true;
      }
    })
  }

  ngOnDestroy() {
    this._routerSub.unsubscribe();
  }

}
