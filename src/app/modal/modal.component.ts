import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger as Logger } from 'ngx-logger';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {

  @Output() modalClose: EventEmitter<boolean> = new EventEmitter<boolean>();


  innerIsActive: boolean = false;

  constructor(
    private _router: Router,
    private _logger: Logger,
  ) { }

  ngOnInit(): void {
    this.innerIsActive = true;

  }

  async closeModal() {
    this._logger.debug('Closing modal');

    await this._router.navigate([{
      outlets: { 'modal': null }
    }], {
      queryParamsHandling: 'preserve',
    });

    this.innerIsActive = true;
    this.modalClose.next(true);

    this._logger.debug('Closed');
  }

  ngOnDestroy() {
  }
}
