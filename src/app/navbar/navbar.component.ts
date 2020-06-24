import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
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
