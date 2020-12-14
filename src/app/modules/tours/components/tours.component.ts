import {Component, OnChanges, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {Rest} from "../../../core/rest/rest.service";
import {DialogService} from "../../../shared/modal/services/dialog-service";
import {ReplaySubject} from "rxjs";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {NotificationService} from "../../../shared/notification/services/notification.service";
import {MuseumEvent} from "../../../core/classes/event";
import {DateTimeHelper} from "../../../core/helpers/datetime-helper";
import {ActivatedRoute, Router} from "@angular/router";
import {Tour} from "../../../core/classes/tour";
import {takeUntil} from "rxjs/internal/operators";
import {AppEditTourComponent} from "./edit-tour.component";

@Component({
  selector: 'app-tours',
  template: `
    <div style="text-align: center">
      <h1 class="background-easy-green">
        Welcome to Tours control page!
      </h1>
      <div class="container">
        <nav>
          <div class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <button type="button" class="btn btn-outline-primary" (click)="goBack()">Back</button>
          </div>
        </nav>
        <span class="justify-center">
          <app-grid [tableHeaders]="getTableHeaders()"
                    [gridRows]="toursRender"
                    (clickEvent)="openEditTour($event)"
                    (deleteEvent)="deleteTour($event)"></app-grid>
        </span>
      </div>
    </div>
  `
})
export class AppToursComponent implements OnInit, OnDestroy, OnChanges {

  private tours: Tour [] = [];
  private readonly destroyed$ = new ReplaySubject<void>(1);
  private toursRender = [];

  private isParsedDate: boolean = false;

  constructor(private rest: Rest,
              private dialog: DialogService,
              private viewContainerRef: ViewContainerRef,
              private loader: LoaderService,
              private router: Router,
              private notification: NotificationService,
              private activateRoute: ActivatedRoute) {
    this.notification.containerRef = this.viewContainerRef;
  }

  ngOnChanges() {
    this.setRenderTours();
  }

  async ngOnInit() {
    this.loader.runLoader(this.viewContainerRef);
    const categoryId = this.activateRoute.snapshot.paramMap.get('id');
    if (categoryId) {
      await this.setToursByUrl(`/tours/all/${categoryId}`);
    } else {
      await this.setToursByUrl(`/tours/all`);
    }
    this.loader.removeLoader();
  }

  private async setToursByUrl(url: string) {
    this.tours = await this.rest.get(url, true);
    if (this.tours) {
      this.setRenderTours();
      this.isParsedDate = true;
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }

  private openEditTour(event): void {
    if (event !== null || event !== undefined) {
      const updatingTour = this.tours[event];
      const ref = this.dialog.open(AppEditTourComponent, {
        data: { tour: updatingTour, isParsedDate: this.isParsedDate },
      });
      ref.afterClosed.pipe(takeUntil(this.destroyed$)).subscribe(result => {
        if (result) {
          this.tours[event] = new Tour(result);
          DateTimeHelper.setRightDateInObject(this.tours[event], ['start_date']);
          this.setRenderTours();
        }
      });
    }
  }

  private async deleteTour(event) {
    this.loader.runLoader(this.viewContainerRef);
    const id = this.tours[event].id;
    const url = `/tours/delete/${id}`;
    let notify = { message: '', class: '' };
    await this.rest.delete(url, true).then(response => {
      if (response) {
        this.removeEvent(id);
        this.setRenderTours();
        notify = {
          message: 'Successfully deleted',
          class: 'success-notify'
        };
      }
    })
      .catch(err => {
        notify = {
          message: err.error,
          class: 'danger-notify'
        };
      });
    this.loader.removeLoader();
    this.notification.showNotification(notify);
    this.notification.closeNotification();
  }

  private setRenderTours(): void {
    this.toursRender = this.tours.map(item => {

      if (!this.isParsedDate && item.start_date) {
        DateTimeHelper.setRightDateInObject(item, ['start_date']);
      }

      return {
        1: ['Delete'],
        2: item.title,
        3: item.description,
        4: item.start_date,
      };
    });
  }

  private getTableHeaders(): {} {
    return {
      1: 'Actions',
      2: 'Title',
      3: 'Description',
      4: 'Start',
    };
  }

  private removeEvent(id: number): void {
    this.tours.forEach((tour, index, array) => {
      if (tour.id === id) {
        array.splice(index, 1);
      }
    });
  }

  private goBack(): void {
    this.router.navigate(['']);
  }

}

