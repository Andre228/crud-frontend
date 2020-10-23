import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClientModule} from "@angular/common/http";
import {LoginModule} from "./modules/login/login.module";
import {AppComponent} from "./app.component";
import {HomeModule} from "./modules/home/home.module";
import {SharedModule} from "./shared/shared.module";
import {APP_ROUTING} from "./router/config/app.routing";
import {AuthGuard} from "./router/guards/auth-guard";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    APP_ROUTING,
    SharedModule,
    HomeModule,
    LoginModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
