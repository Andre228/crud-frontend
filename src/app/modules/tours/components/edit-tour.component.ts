import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {DialogConfig} from "../../../shared/modal/services/dialog-config";
import {DialogRef} from "../../../shared/modal/services/dialog-ref";
import {Rest} from "../../../core/rest/rest.service";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {NotificationService} from "../../../shared/notification/services/notification.service";
import {DateTimeHelper} from "../../../core/helpers/datetime-helper";
import {Tour} from "../../../core/classes/tour";

@Component({
  selector: 'app-edit-tour',
  template: `
      <div class="container">
        <div class="card">
          <div class="card-header justify-flex">
            <span>Edit you tour</span>
            <button type="button" class="btn m-r-2" (click)="onClose()">X</button>
          </div>
          <div class="card-body">
            <div>
              <h5 class="card-title">Title</h5>
              <textarea type="text" class="form-control" [(ngModel)]="tour.title"></textarea>
            </div>
            <div>
              <h5 class="card-title">Description</h5>
              <textarea type="text" class="form-control" [(ngModel)]="tour.description"></textarea>
            </div>
            <div>
              <h5 class="card-title">Start</h5>
              <input type="datetime-local" class="form-control" [ngModel]="tour.start_date | date:'yyyy-MM-ddTHH:mm:ss'"
                                                                (ngModelChange)="tour.start_date = $event">
            </div>
            <div class="justify-flex-reverse">
              <button type="button" class="btn btn-primary m-t-1 m-l-2" (click)="editEvent($event)">Save</button>
            </div>
          </div>
        </div>
      </div>
  `
})
export class AppEditTourComponent implements OnInit {

  private tour = new Tour();

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
      this.tour = this.config.data.tour;
      if (!this.isParsedDate) {
        DateTimeHelper.setRightDateInObject(this.tour, ['start_date']);
      }
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  private async editEvent(event) {
    if (this.isValid() && this.checkDates()) {
      this.loader.runLoader(this.viewContainerRefLoader, { message: 'Updating tour, please wait...' });


      DateTimeHelper.setToValidDateFormat(this.tour, 'start_date');

      let notify = { message: '', class: '' };

      this.tour = await this.rest.put('/tours/update', this.tour, true).then(response => {
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

      if (this.tour) {
        this.afterRequest(notify, this.tour);
      }
      this.afterRequest(notify);
    }
  }

  private afterRequest(notify: {}, event?: Tour): void {
    this.loader.removeLoader();
    this.notification.showNotification(notify);
    this.notification.closeNotification();
    if (event) {
      this.dialogRef.close(event);
    }
  }

  private isValid(): boolean {
    return !!(this.tour.description && this.tour.start_date && this.tour.title);
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
