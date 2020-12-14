import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {DialogConfig} from "../../../shared/modal/services/dialog-config";
import {DialogRef} from "../../../shared/modal/services/dialog-ref";
import {Rest} from "../../../core/rest/rest.service";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {NotificationService} from "../../../shared/notification/services/notification.service";
import {MuseumEvent} from "../../../core/classes/event";
import {Post} from "../../../core/classes/post";
import {DateTimeHelper} from "../../../core/helpers/datetime-helper";

@Component({
  selector: 'app-create-event',
  template: `
      <div class="container">
        <div class="card">
          <div class="card-header justify-flex">
            <span>Create you event</span>
            <button type="button" class="btn m-r-2" (click)="onClose()">X</button>
          </div>
          <div class="card-body">
            <div>
              <h5 class="card-title">Description</h5>
              <input type="text" class="form-control" [(ngModel)]="event.description">
            </div>
            <div>
              <h5 class="card-title">Start</h5>
              <input type="datetime-local" class="form-control" [(ngModel)]="event.start_date">
            </div>
            <div>
              <h5 class="card-title">End</h5>
              <input type="datetime-local" class="form-control" [(ngModel)]="event.end_date">
            </div>
            <div class="justify-flex-reverse">
              <button type="button" class="btn btn-primary m-t-1 m-l-2" (click)="createNewEvent($event)">Create</button>
            </div>
          </div>
        </div>
      </div>
  `
})
export class AppCreateEventComponent implements OnInit {

  private event = new MuseumEvent();
  private post = new Post();

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
      this.post = this.config.data.post;
      this.event.post = this.post;
    }
  }

  onClose() {
    this.dialogRef.close('event value');
  }

  private async createNewEvent(event) {
    if (this.isValid() && this.checkDates()) {
      this.loader.runLoader(this.viewContainerRefLoader, { message: 'Creating a new event, please wait...' });

      this.event.created_at = new Date();
      this.event.updated_at = new Date();

      let notify = { message: '', class: '' };

      await this.rest.post('/events/create', this.event, true).then(response => {
        if (response) {
          notify = {
            message: 'Successfully created',
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

      this.afterRequest(notify);
    }
  }

  private afterRequest(notify: {}): void {
    this.loader.removeLoader();
    this.notification.showNotification(notify);
    this.notification.closeNotification();
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
