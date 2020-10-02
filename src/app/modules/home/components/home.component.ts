import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  template: `
    <div style="text-align:center">
      <h1 class="background-easy-green">
        Welcome to Home!
      </h1>
    </div>
  `
})
export class AppHomeComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit() {
  }
}
