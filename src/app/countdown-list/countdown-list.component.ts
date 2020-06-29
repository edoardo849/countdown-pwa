import { Component, OnInit, AfterContentInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { StorageService } from '@app/services/storage.service';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { tap, map, switchMap, filter } from 'rxjs/operators';
import { Event, Status } from '@app/models/event.model';
import { NGXLogger as Logger } from 'ngx-logger';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-countdown-list',
  templateUrl: './countdown-list.component.html',
  styleUrls: ['./countdown-list.component.scss']
})
export class CountdownListComponent implements OnInit, AfterContentInit, OnDestroy {

  public showHero$: Observable<boolean>;
  public _showHeroSub: BehaviorSubject<boolean>;

  public filter: Status;
  public events$: Observable<Event[]>;
  private _routerSub: Subscription;

  constructor(
    private _storageService: StorageService,
    private _logger: Logger,
    private _router: ActivatedRoute,
  ) {

  }

  async ngOnInit() {
    this._showHeroSub = new BehaviorSubject(false);
    this.showHero$ = this._showHeroSub.asObservable();
  }

  async ngAfterContentInit() {
    this.events$ = this._router.queryParamMap.pipe(
      map(params => params.get('events')),
      tap((filter: Status) => {
        this._logger.log('Filtering events', filter);
        this.filter = filter;
      }),
      switchMap(filter => this._storageService.getAllEvents(filter)),
      tap(events => {
        this._logger.log('Loaded events: ', events)
        if ((events && events.length > 0) || (events && events.length === 0 && this.filter === Status.EXPIRED)) {
          this._showHeroSub.next(false);
        } else {
          this._showHeroSub.next(true);
        }
      })
    );
  }

  ngOnDestroy() {
    this._routerSub.unsubscribe();
  }

}
