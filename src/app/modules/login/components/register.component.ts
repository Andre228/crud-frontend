import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormControl, FormGroup} from "@angular/forms";
import {ReplaySubject} from "rxjs";
import {APP_HOST} from "../../../core/config";
import {takeUntil} from "rxjs/internal/operators";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-register',
  template: `
  <div class="container col-6 m-t-3">
    <form [formGroup]="formData" (submit)="register($event)">
      <div class="form-group">
        <label for="exampleInputEmail1">Email адрес</label>
        <input formControlName="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
        <small id="emailHelp" class="form-text text-muted">Мы никогда никому не передадим вашу электронную почту</small>
      </div>
      <div class="form-group">
        <label for="exampleInputName">Придумайте логин</label>
        <input formControlName="name" type="text" class="form-control" id="exampleInputName">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Пароль</label>
        <input formControlName="password" type="password" class="form-control" id="exampleInputPassword1">
      </div>
      <div class="justify-flex-reverse">
        <button type="submit" class="btn btn-primary" [disabled]="isLoading">Зарегистрироваться</button>
        <div *ngIf="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only"></span>
        </div>
      </div>
    </form>
    <app-alert *ngIf="class && text" [class]="class" [text]="text"></app-alert>
  </div>
  `
})
export class AppRegisterComponent implements OnInit, OnDestroy {

  private formData: FormGroup;

  private class: string = '';
  private text: string = '';

  private isLoading: boolean = false;

  private readonly destroyed$ = new ReplaySubject<void>(1);

  constructor(private http: HttpClient,
              private authService: AuthService) {}

  ngOnDestroy() {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.formData = new FormGroup({
      email    : new FormControl(),
      name     : new FormControl(),
      password : new FormControl()
    });
  }

  private async register(event) {

    this.isLoading = true;

    this.formData.value.updated_at = new Date();

    const createdUser = await this.authService.register(this.formData.value)
      .catch((err) => {
        this.class = 'alert-danger';
        this.text = err.error.message;
        this.isLoading = false;
      });
      if (createdUser) {
        this.class = 'alert-success';
        this.text = 'Пользователь зарегистрирован';
        this.isLoading = false;
      }
  }
}
