import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './modules/login/services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <header>
      <nav class="navbar navbar-expand-md navbar-dark fixed-bottom bg-danger">
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" routerLink="/">Home<span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item" *ngIf="!isShowSignElements()">
              <a class="nav-link" routerLink="/login">Sign in</a>
            </li>
            <li class="nav-item" *ngIf="!isShowSignElements()">
              <a class="nav-link" routerLink="/register">Sign up</a>
            </li>
            <li class="nav-item" *ngIf="isShowSignElements()">
              <a class="nav-link btn" (click)="logout()">Logout</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient,
              private authService: AuthService) {}

  ngOnInit() {}

  private logout(): void {
    this.authService.logout();
  }

  private isShowSignElements(): boolean {
    return this.authService.isLoggedIn();
  }
}
