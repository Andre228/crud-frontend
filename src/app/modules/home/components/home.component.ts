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
        <a style="cursor: pointer;" class="nav-link" (click)="toCategories()">Categories</a>
        <a style="cursor: pointer;" class="nav-link" (click)="toPosts()">Posts</a>
        <a style="cursor: pointer;" class="nav-link" (click)="toUsers()">Users</a>
    </div>
  `
})
export class AppHomeComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
  }

  private toCategories(): void {
    this.router.navigate(['categories']);
  }

  private toPosts(): void {
    this.router.navigate(['posts']);
  }

  private toUsers(): void {
    this.router.navigate(['users']);
  }
}
