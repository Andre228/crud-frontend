import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClientModule} from "@angular/common/http";
import {AppHomeComponent} from "./components/home.component";
import {CategoriesModule} from "../categories/categories.module";

@NgModule({
  declarations: [
    AppHomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CategoriesModule
  ],
  providers: [],
  bootstrap: []
})
export class HomeModule { }
