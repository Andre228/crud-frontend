import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClientModule} from "@angular/common/http";
import {AppCategoriesComponent} from "./components/categories.component";
import {SharedModule} from "../../shared/shared.module";
import {AppEditCategoryComponent} from "./components/edit-category.component";

@NgModule({
  declarations: [
    AppCategoriesComponent,
    AppEditCategoryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule
  ],
  entryComponents: [AppEditCategoryComponent],
  providers: [],
  bootstrap: []
})
export class CategoriesModule { }

