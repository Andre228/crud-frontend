import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  template: `
  <div class="container col-6 m-t-3">
    <form [formGroup]="formData" (submit)="login($event)">
      <div class="form-group">
        <label for="exampleInputName">Email адрес</label>
        <input formControlName="username" type="text" class="form-control" id="exampleInputName" aria-describedby="nameHelp" name="username">
        <small id="nameHelp" class="form-text text-muted" name="name">Мы никогда никому не передадим вашу электронную почту</small>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Пароль</label>
        <input formControlName="password" type="password" class="form-control" id="exampleInputPassword1" name="password">
      </div>
      <div class="justify-flex-reverse">
        <button type="submit" class="btn btn-primary" [disabled]="isLoading">Войти</button>
        <div *ngIf="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only"></span>
        </div>
      </div>
    </form>
    <app-alert *ngIf="class && text" [class]="class" [text]="text"></app-alert>
  </div>
  `
})
export class AppLoginComponent implements OnInit {

  private formData: FormGroup;

  private class: string = '';
  private text: string = '';

  private isLoading: boolean = false;


  constructor(private authService: AuthService,
              private http: HttpClient,
              private router: Router) {}


  async ngOnInit() {
    this.formData = new FormGroup({
      username : new FormControl(),
      password : new FormControl()
    });
  }

  private login(event): void {
    if (this.formData.value && this.formData.value.username && this.formData.value.password) {
      this.getUser();
    } else if (!this.formData.value.username) {
      this.class = 'alert-danger';
      this.text = 'Введите логин';
    } else if (!this.formData.value.password) {
      this.class = 'alert-danger';
      this.text = 'Введите пароль';
    }
  }


  private async getUser() {
    this.isLoading = true;
    const loggedUser = await this.authService.login(this.formData.value)
      .catch((err) => {
        this.class = 'alert-danger';
        this.text = err.error;
        this.isLoading = false;
      });
      if (loggedUser) {
        this.class = 'alert-success';
        this.text = 'Вы вошли';
        this.isLoading = false;
        this.authService.setLoginStatus(true);
      }
  }
}
