import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {DialogConfig} from "../../../shared/modal/services/dialog-config";
import {DialogRef} from "../../../shared/modal/services/dialog-ref";
import {Rest} from "../../../core/rest/rest.service";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {NotificationService} from "../../../shared/notification/services/notification.service";
import {DateTimeHelper} from "../../../core/helpers/datetime-helper";
import {Tour} from "../../../core/classes/tour";

@Component({
  selector: 'app-create-tour',
  template: `
      <div class="container">
        <div class="card">
          <div class="card-header justify-flex">
            <span>Create you tour</span>
            <button type="button" class="btn m-r-2" (click)="onClose()">X</button>
          </div>
          <div class="card-body">
            <div>
              <h5 class="card-title">Title</h5>
              <input type="text" class="form-control" [(ngModel)]="tour.title" maxlength="255">
            </div>
            <div>
              <h5 class="card-title">Description</h5>
              <textarea class="form-control" [(ngModel)]="tour.description" maxlength="350"></textarea>
            </div>
            <div>
              <h5 class="card-title">Start</h5>
              <input type="datetime-local" class="form-control" [(ngModel)]="tour.start_date">
            </div>
            <div class="justify-flex-reverse">
              <button type="button" class="btn btn-primary m-t-1 m-l-2" (click)="createNewEvent($event)">Create</button>
            </div>
          </div>
        </div>
      </div>
  `
})
export class AppCreateTourComponent implements OnInit {

  private tour = new Tour();

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
      this.tour.category = this.config.data.category;
    }
  }

  onClose() {
    this.dialogRef.close('event value');
  }

  private async createNewEvent(event) {
    if (this.checkDates() && this.isValid()) {
      this.loader.runLoader(this.viewContainerRefLoader, { message: 'Creating a new tour, please wait...' });


      let notify = { message: '', class: '' };

      await this.rest.post('/tours/create', this.tour, true).then(response => {
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
    return !!(this.tour.description && this.tour.title && this.tour.start_date);
  }

  private checkDates(): boolean {
    const notify = { message: 'Start date cannot be more than now date', class: 'warning-notify' };
    if (!DateTimeHelper.isExpired(this.tour.start_date)) {
      this.notification.showNotification(notify);
      this.notification.closeNotification();
      return false;
    }
    return true;
  }

}
