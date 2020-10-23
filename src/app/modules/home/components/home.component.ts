import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  template: `
    <div style="text-align:center">
      <h1 class="background-easy-green">
        Welcome to Home!
      </h1>
        <a style="cursor: pointer;" class="nav-link" (click)="toCategories()">Категории</a>
    </div>
  `
})
export class AppHomeComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
  }

  toCategories() {
    this.router.navigate(['categories']);
  }
}
