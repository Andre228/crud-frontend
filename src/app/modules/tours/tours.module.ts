import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "../../shared/shared.module";
import {AppToursComponent} from "./components/tours.component";
import {AppCreateTourComponent} from "./components/create-tour.component";
import {AppEditTourComponent} from "./components/edit-tour.component";

@NgModule({
  declarations: [
    AppToursComponent,
    AppCreateTourComponent,
    AppEditTourComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule
  ],
  entryComponents: [AppEditTourComponent],
  providers: [],
  bootstrap: []
})
export class TourModule { }
