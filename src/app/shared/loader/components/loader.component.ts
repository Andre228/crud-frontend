import {Component, Input, OnInit} from '@angular/core';
@Component({
  selector: 'app-loader',
  template: `
    <div class="overlay-loader">
      <div class="spinner-border text-light" role="status">
      </div>
      <span class="text-light">{{ getLoaderText() }}</span>
    </div>
  `
})
export class AppLoaderComponent implements OnInit {

  @Input() data: any;

  constructor() {}

  private getLoaderText(): string {
    return this.data ? this.data.message : 'Loading...';
  }

  ngOnInit() {}

}
