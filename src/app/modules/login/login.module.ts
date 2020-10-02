import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClientModule} from "@angular/common/http";
import {AppLoginComponent} from "./components/login.component";
import {AppRegisterComponent} from "./components/register.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {AuthService} from "./services/auth.service";

@NgModule({
  declarations: [
    AppLoginComponent,
    AppRegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents: [],
  providers: [AuthService],
  bootstrap: []
})
export class LoginModule { }
