import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClient, HttpClientModule} from "@angular/common/http";
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AppUsersComponent} from "./components/users.component";

@NgModule({
  declarations: [
    AppUsersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  entryComponents: [],
  providers: [HttpClient],
  bootstrap: []
})
export class UsersModule { }

