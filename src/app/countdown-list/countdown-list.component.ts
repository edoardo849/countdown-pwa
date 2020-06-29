import { Component, OnInit, AfterContentInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { StorageService } from '@app/services/storage.service';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
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
  public showHero: boolean = true;


  public events$: Observable<Event[]>;
  public expiredEvents$: Observable<Event[]>;


  private _routerSub: Subscription;

  constructor(
    private _storageService: StorageService,
    private _logger: Logger,
    private _changeDetector: ChangeDetectorRef,
    private _router: ActivatedRoute,
  ) {

  }

  async ngOnInit() {
    this._logger.log('Loading events');

    const activeEvents = await this._storageService.getAllEvents();
    this.events$ = activeEvents.pipe(
      tap(events => {
        if (events !== null && events.length !== 0) {
          this._logger.debug('Active Events loaded', events);
          this.showHero = false;
          this._changeDetector.detectChanges();
        }
      })
    );

    const expiredEvents = await this._storageService.getAllExpiredEvents();
    this.expiredEvents$ = expiredEvents.pipe(
      tap(events => {
        if (events !== null && events.length !== 0) {
          this._logger.debug('Expired Events loaded', events);
          this.showHero = false;
          this._changeDetector.detectChanges();
        }
      })
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
