import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { StorageService } from '@app/storage.service';
import { Observable, from, defer, Subject, BehaviorSubject, Subscription } from 'rxjs';
import { filter, tap, switchMap, flatMap } from 'rxjs/operators';
import { Event } from '@app/models/event.model';
import { NGXLogger as Logger } from 'ngx-logger';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-countdown-list',
  templateUrl: './countdown-list.component.html',
  styleUrls: ['./countdown-list.component.scss']
})
export class CountdownListComponent implements OnInit, AfterContentInit, OnDestroy {

  private expiredEvents: boolean = false;
  public events$: Observable<Event[]>;
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
    this.events$ = this._router.queryParamMap.pipe(

      switchMap(async (params) => {
        this._logger.log('Router params', params);
        if (params.get('events') === 'expired') {
          return await this._storageService.getAllExpiredEvents();
        }
        return await this._storageService.getAllEvents();
      }),
      flatMap(events => events),
      filter((events => events !== null)),
      tap(events => this._logger.debug('Events loaded', events))
    );
  }

  async ngAfterContentInit() {
    this._router.queryParamMap.subscribe(params => {

      if (params.get('events') === 'expired') {
        this._titleSubject.next('Expired Events');
      } else {
        this._titleSubject.next('Active Events');
      }
    })
  }

  ngOnDestroy() {
    this._routerSub.unsubscribe();
  }

}
