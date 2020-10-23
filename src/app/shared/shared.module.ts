import {ALERT_DECLARATIONS} from "./alert/components/index";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {CoreModule} from "../core/core.module";
import {GRID_DECLARATIONS} from "./grid/components/index";
import {MODAL_DECLARATIONS} from "./modal/components/index";
import {DialogService} from "./modal/services/dialog-service";
import {AppDialogComponent} from "./modal/components/dialog.component";
import {InsertionDirective} from "./modal/services/insertion.directive";
import {DialogRef} from "./modal/services/dialog-ref";


@NgModule({
  declarations: [
    ...ALERT_DECLARATIONS,
    ...GRID_DECLARATIONS,
    ...MODAL_DECLARATIONS,
    InsertionDirective
  ],
  exports: [
    ...ALERT_DECLARATIONS,
    ...GRID_DECLARATIONS,
    ...MODAL_DECLARATIONS,
    FormsModule
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CoreModule
  ],
  providers: [DialogService, InsertionDirective, DialogRef],
  entryComponents: [AppDialogComponent]
})
export class SharedModule { }
