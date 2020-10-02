import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {ReplaySubject} from "rxjs";
import {APP_HOST} from "../../../core/config";
import {takeUntil} from "rxjs/internal/operators";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  template: `
  <div class="container col-6 m-t-3">
    <form [formGroup]="formData" (submit)="login($event)">
      <div class="form-group">
        <label for="exampleInputName">Email адрес</label>
        <input formControlName="name" type="text" class="form-control" id="exampleInputName" aria-describedby="nameHelp">
        <small id="nameHelp" class="form-text text-muted">Мы никогда никому не передадим вашу электронную почту</small>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Пароль</label>
        <input formControlName="password" type="password" class="form-control" id="exampleInputPassword1">
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
export class AppLoginComponent implements OnInit, OnDestroy {

  private formData: FormGroup;

  private class: string = '';
  private text: string = '';

  private isLoading: boolean = false;

  private readonly destroyed$ = new ReplaySubject<void>(1);

  constructor(private authService: AuthService) {}

  ngOnDestroy() {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.formData = new FormGroup({
      name     : new FormControl(),
      password : new FormControl()
    });
  }

  private login(event): void {
    if (this.formData.value && this.formData.value.name && this.formData.value.password) {
      this.getUser();
    } else if (!this.formData.value.name) {
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
        this.text = err.error.message;
        this.isLoading = false;
      });
      if (loggedUser) {
        this.class = 'alert-success';
        this.text = 'Вы вошли';
        this.isLoading = false;
      }
  }
}
