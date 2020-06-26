import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PwaService } from '@app/pwa.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public toggleExpiredBtn: boolean = true;

  constructor(
    public pwaService: PwaService,
    private _router: Router
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
}
