import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AppEventsComponent} from "./components/events.component";
import {AppCreateEventComponent} from "./components/create-event.component";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "../../shared/shared.module";
import {AppEditEventComponent} from "./components/edit-event.component";

@NgModule({
  declarations: [
    AppEventsComponent,
    AppCreateEventComponent,
    AppEditEventComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule
  ],
  entryComponents: [AppEditEventComponent],
  providers: [],
  bootstrap: []
})
export class EventModule { }
