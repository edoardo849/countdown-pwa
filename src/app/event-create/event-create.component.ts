import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {

  colours: any = [
    { label: 'Pink', value: '#E91E63' },
    { label: 'Purple', value: '#9C27B0' },
    { label: 'Blue', value: '#2196F3' },

    { label: 'Green', value: '#4CAF50' },
    { label: 'Yellow', value: '#FFC107' },

  ];

  constructor() { }

  ngOnInit(): void {
  }
}
