import { Component, OnInit, AfterContentInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { StorageService } from '@app/services/storage.service';
import { Observable, Subscription } from 'rxjs';
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

  public showHero: boolean = true;
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
        if (events && events.length > 0) {
          this.showHero = false;
        } else if (events && events.length === 0 && this.filter === Status.EXPIRED) {
          this.showHero = false;
        } else {
          this.showHero = true;
        }
      })
    );
  }

  ngOnDestroy() {
    this._routerSub.unsubscribe();
  }

}
