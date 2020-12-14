import {Component, OnChanges, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {Rest} from "../../../core/rest/rest.service";
import {DialogService} from "../../../shared/modal/services/dialog-service";
import {ReplaySubject} from "rxjs";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {NotificationService} from "../../../shared/notification/services/notification.service";
import {MuseumEvent} from "../../../core/classes/event";
import {takeUntil} from "rxjs/internal/operators";
import {AppEditEventComponent} from "./edit-event.component";
import {DateTimeHelper} from "../../../core/helpers/datetime-helper";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-events',
  template: `
    <div style="text-align: center">
      <h1 class="background-easy-green">
        Welcome to Events control page!
      </h1>
      <div class="container">
        <nav>
          <div class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <button type="button" class="btn btn-outline-primary" (click)="goBack()">Back</button>
          </div>
        </nav>
        <span class="justify-center">
          <app-grid [tableHeaders]="getTableHeaders()"
                    [gridRows]="eventsRender"
                    (clickEvent)="openEditEvent($event)"
                    (deleteEvent)="deleteEvent($event)"></app-grid>
        </span>
      </div>
    </div>
  `
})
export class AppEventsComponent implements OnInit, OnDestroy, OnChanges {

  private events: MuseumEvent [] = [];
  private readonly destroyed$ = new ReplaySubject<void>(1);
  private eventsRender = [];

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
    this.setRenderEvents();
  }

  async ngOnInit() {
    this.loader.runLoader(this.viewContainerRef);
    const postId = this.activateRoute.snapshot.paramMap.get('id');
    if (postId) {
      await this.setEventsByUrl(`/events/all/${postId}`);
    } else {
      await this.setEventsByUrl(`/events/all`);
    }
    this.loader.removeLoader();
  }

  private async setEventsByUrl(url: string) {
    this.events = await this.rest.get(url, true);
    if (this.events) {
      this.setRenderEvents();
      this.isParsedDate = true;
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }

  private openEditEvent(event): void {
    if (event !== null || event !== undefined) {
      const updatingEvent = this.events[event];
      const ref = this.dialog.open(AppEditEventComponent, {
        data: { event: updatingEvent, isParsedDate: this.isParsedDate },
      });
      ref.afterClosed.pipe(takeUntil(this.destroyed$)).subscribe(result => {
        if (result) {
          this.events[event] = new MuseumEvent(result);
          DateTimeHelper.setRightDateInObject(this.events[event], ['start_date', 'end_date']);
          this.setRenderEvents();
        }
      });
    }
  }

  private async deleteEvent(event) {
    this.loader.runLoader(this.viewContainerRef);
    const id = this.events[event].id;
    const url = `/events/delete/${id}`;
    let notify = { message: '', class: '' };
    await this.rest.delete(url, true).then(response => {
      if (response) {
        this.removeEvent(id);
        this.setRenderEvents();
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

  private setRenderEvents(): void {
    this.eventsRender = this.events.map(item => {
      if (item.start_date && item.end_date && !this.isParsedDate) {
        DateTimeHelper.setRightDateInObject(item, ['start_date', 'end_date']);
      }

      return {
        1: ['Delete'],
        2: item.description,
        3: item.start_date,
        4: item.end_date
      };
    });
  }

  private getTableHeaders(): {} {
    return {
      1: 'Actions',
      2: 'Description',
      3: 'Start',
      4: 'End',
    };
  }

  private removeEvent(id: number): void {
    this.events.forEach((event, index, array) => {
      if (event.id === id) {
        array.splice(index, 1);
      }
    });
  }

  private goBack(): void {
    this.router.navigate(['']);
  }

}

