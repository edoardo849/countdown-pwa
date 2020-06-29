import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PwaService } from '@app/pwa.service';
import { LayoutModule, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { NGXLogger as Logger } from 'ngx-logger';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public toggleExpiredBtn: boolean = true;

  private _breakPointSubscription: Subscription;

  constructor(
    public pwaService: PwaService,
    private _router: Router,
    //private _breakpointObserver: BreakpointObserver,
    private _logger: Logger,
  ) { }

  ngOnInit(): void {

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
    //this._breakPointSubscription.unsubscribe();
  }
}
