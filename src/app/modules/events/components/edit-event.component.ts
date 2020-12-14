import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {DialogConfig} from "../../../shared/modal/services/dialog-config";
import {DialogRef} from "../../../shared/modal/services/dialog-ref";
import {Rest} from "../../../core/rest/rest.service";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {NotificationService} from "../../../shared/notification/services/notification.service";
import {MuseumEvent} from "../../../core/classes/event";
import {DateTimeHelper} from "../../../core/helpers/datetime-helper";

@Component({
  selector: 'app-edit-event',
  template: `
      <div class="container">
        <div class="card">
          <div class="card-header justify-flex">
            <span>Edit you event</span>
            <button type="button" class="btn m-r-2" (click)="onClose()">X</button>
          </div>
          <div class="card-body">
            <div>
              <h5 class="card-title">Description</h5>
              <textarea type="text" class="form-control" [(ngModel)]="event.description"></textarea>
            </div>
            <div>
              <h5 class="card-title">Start</h5>
              <input type="datetime-local" class="form-control" [ngModel]="event.start_date | date:'yyyy-MM-ddTHH:mm:ss'"
                                                                (ngModelChange)="event.start_date = $event">
            </div>
            <div>
              <h5 class="card-title">End</h5>
              <input type="datetime-local" class="form-control" [ngModel]="event.end_date | date:'yyyy-MM-ddTHH:mm:ss'"
                                                                (ngModelChange)="event.end_date = $event">
            </div>
            <div class="justify-flex-reverse">
              <button type="button" class="btn btn-primary m-t-1 m-l-2" (click)="editEvent($event)">Save</button>
            </div>
          </div>
        </div>
      </div>
  `
})
export class AppEditEventComponent implements OnInit {

  private event = new MuseumEvent();

  private isParsedDate: boolean = false;

  constructor(private rest: Rest,
              private viewContainerRefLoader: ViewContainerRef,
              private config: DialogConfig,
              private dialogRef: DialogRef,
              private loader: LoaderService,
              private notification: NotificationService) {
    this.notification.containerRef = viewContainerRefLoader;
  }

  ngOnInit() {
    if (this.config && this.config.data) {
      this.isParsedDate = this.config.data.isParsedDate;
      this.event = this.config.data.event;
      if (!this.isParsedDate) {
        DateTimeHelper.setRightDateInObject(this.event, ['start_date', 'end_date']);
      }
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  private async editEvent(event) {
    if (this.isValid() && this.checkDates()) {
      this.loader.runLoader(this.viewContainerRefLoader, { message: 'Updating event, please wait...' });

      this.event.updated_at = new Date();

      DateTimeHelper.setToValidDateFormat(this.event, 'start_date');
      DateTimeHelper.setToValidDateFormat(this.event, 'end_date');

      let notify = { message: '', class: '' };

      this.event = await this.rest.put('/events/update', this.event, true).then(response => {
        if (response) {
          notify = {
            message: 'Successfully updated',
            class: 'success-notify'
          };
        } else {
          Promise.reject('Unknown error');
        }
        return response;
      })
        .catch(err => {
          notify = {
            message: err.error,
            class: 'danger-notify'
          };
        });

      if (this.event) {
        this.afterRequest(notify, this.event);
      }
      this.afterRequest(notify);
    }
  }

  private afterRequest(notify: {}, event?: MuseumEvent): void {
    this.loader.removeLoader();
    this.notification.showNotification(notify);
    this.notification.closeNotification();
    if (event) {
      this.dialogRef.close(event);
    }
  }

  private isValid(): boolean {
    return !!(this.event.description && this.event.start_date && this.event.end_date);
  }

  private checkDates(): boolean {
    const notify = { message: 'Start date cannot be more than end date', class: 'warning-notify' };
    if (!DateTimeHelper.isValidStartAndEndDates(this.event.start_date, this.event.end_date)) {
      this.notification.showNotification(notify);
      this.notification.closeNotification();
      return false;
    }
    return true;
  }

}
