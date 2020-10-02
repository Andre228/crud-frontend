import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-alert',
  template: `
    <div style="margin-top: 10px;" [class]="getClass()" role="alert">
      {{ text }}
    </div>
  `
})
export class AppAlertComponent implements OnInit {

  @Input() class: string = '';
  @Input() text: string = '';

  constructor() {}

  ngOnInit() {

  }

  getClass(): string {
    return `alert ${this.class}`;
  }

}

