import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-countdown-item',
  templateUrl: './countdown-item.component.html',
  styleUrls: ['./countdown-item.component.scss']
})
export class CountdownItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  delete(): void {
    console.log("ToDo");
  }

}
