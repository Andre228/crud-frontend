import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "../../shared/shared.module";
import {AppCommentsComponent} from "./components/comments.component";

@NgModule({
  declarations: [
    AppCommentsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule
  ],
  entryComponents: [],
  providers: [],
  bootstrap: []
})
export class CommentsModule { }


