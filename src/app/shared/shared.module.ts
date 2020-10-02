import {ALERT_DECLARATIONS} from "./alert/components/index";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {CoreModule} from "../core/core.module";


@NgModule({
  declarations: [
    ...ALERT_DECLARATIONS
  ],
  exports: [
    ...ALERT_DECLARATIONS
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CoreModule
  ],
  providers: [],
  entryComponents: []
})
export class SharedModule { }
