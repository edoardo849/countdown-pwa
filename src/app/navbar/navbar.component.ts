import { Component, OnInit, OnDestroy, Inject, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { PwaService } from '@app/services/pwa.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { NGXLogger as Logger } from 'ngx-logger';
import { DOCUMENT } from '@angular/common';
import { NotificationService } from '@app/services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy, AfterContentInit {

  public toggleExpiredBtn: boolean = true;
  public isHandset: boolean = true;

  private _breakPointSubscription: Subscription;

  constructor(
    public pwaService: PwaService,
    private _router: Router,
    private _breakpointObserver: BreakpointObserver,
    private _logger: Logger,
    //@Inject(DOCUMENT) private _document: Document,
    public notificationService: NotificationService,
  ) { }

  ngOnInit(): void { }

  ngAfterContentInit() {
    this._breakpointObserver.observe([
      '(max-width: 1023px)', // https://bulma.io/documentation/helpers/visibility-helpers/
    ]).subscribe(result => {
      this._logger.log('MediaQuery result', result);
      if (result.matches) {
        //this._logger.log('Fixing navbar bottom', result);
        //this._document.documentElement.className = 'has-navbar-fixed-bottom';
        this.isHandset = true;
      } else {
        //this._logger.log('Fixing navbar top', result);
        //this._document.documentElement.className = 'has-navbar-fixed-top';
        this.isHandset = false;
      }
    });
  }

  async newEvent() {
    await this._router.navigate([{
      outlets: {
        'modal': ['new-event']
      }
    }], {
      queryParamsHandling: 'preserve',
    });
  }

  ngOnDestroy() {
    this._breakPointSubscription.unsubscribe();
  }
}
