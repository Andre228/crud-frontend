import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClientModule} from "@angular/common/http";
import {AppCategoriesComponent} from "./components/categories.component";
import {SharedModule} from "../../shared/shared.module";
import {AppEditCategoryComponent} from "./components/edit-category.component";
import {AppCreateCategoryComponent} from "./components/create-category.component";

@NgModule({
  declarations: [
    AppCategoriesComponent,
    AppEditCategoryComponent,
    AppCreateCategoryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule
  ],
  entryComponents: [AppEditCategoryComponent, AppCreateCategoryComponent],
  providers: [],
  bootstrap: []
})
export class CategoriesModule { }

