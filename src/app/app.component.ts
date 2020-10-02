import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
    <!--<nav class="nav">-->
      <!--<a class="nav-link active" routerLink="/">Домой</a>-->
      <!--<a class="nav-link" routerLink="/login">Войти</a>-->
      <!--<a class="nav-link" routerLink="/register">Регистрация</a>-->
    <!--</nav>-->
    <header>
      <nav class="navbar navbar-expand-md navbar-dark fixed-bottom bg-danger">
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" routerLink="/">Домой<span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/login">Войти</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/register">Регистрация</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:8081/users?id=4').subscribe(item => {
      console.log(item);
    });
  }
}
