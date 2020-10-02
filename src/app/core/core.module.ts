import { NgModule } from '@angular/core';
import {Rest} from "./rest/rest.service";

@NgModule({
  providers: [
    Rest
  ]
})
export class CoreModule {
}
