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
import {GlobalInsertionDirective} from "./global-insertion";
import {LoaderService} from "./loader/services/loader.service";
import {LOADER_DECLARATIONS} from "./loader/components/index";
import {AppLoaderComponent} from "./loader/components/loader.component";
import {NOTIFICATION_DECLARATIONS} from "./notification/components/index";
import {AppNotificationComponent} from "./notification/components/notification.component";


@NgModule({
  declarations: [
    ...ALERT_DECLARATIONS,
    ...GRID_DECLARATIONS,
    ...MODAL_DECLARATIONS,
    ...LOADER_DECLARATIONS,
    ...NOTIFICATION_DECLARATIONS,
    InsertionDirective,
    GlobalInsertionDirective
  ],
  exports: [
    ...ALERT_DECLARATIONS,
    ...GRID_DECLARATIONS,
    ...MODAL_DECLARATIONS,
    ...LOADER_DECLARATIONS,
    ...NOTIFICATION_DECLARATIONS,
    FormsModule
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CoreModule
  ],
  providers: [DialogService, InsertionDirective, DialogRef, GlobalInsertionDirective, LoaderService],
  entryComponents: [AppDialogComponent, AppLoaderComponent, AppNotificationComponent]
})
export class SharedModule { }
