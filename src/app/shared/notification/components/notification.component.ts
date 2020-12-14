import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-notification',
  template: `
    <div [class]="getClass()" (click)="close()">
      {{ data.message }}
    <div class="progress" style="height: 2px;">
      <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width' : getProgressWidth() }" aria-valuemin="0" aria-valuemax="100">
      </div>
    </div>
    </div>
  `
})
export class AppNotificationComponent implements OnInit, OnDestroy {

  @Input() class: string = '';
  @Input() text: string = '';
  @Input() data: any;

  private progress: number = 0;
  private progressUpdateTime = 100;
  private howmuch: number = 0;
  private intervalId: number = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.howmuch = this.progressUpdateTime / (this.notificationService.getNotificationLifeCycle() / this.progressUpdateTime);
    this.intervalId = setInterval(() => {
      this.updateProgress();
    }, this.progressUpdateTime - (this.howmuch * 4));
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  private updateProgress(): void {
    this.progress += this.howmuch;
  }

  getProgressWidth(): string {
    return this.progress + '%';
  }

  private getClass(): string {
    return 'notification-wrapper ' + this.data.class;
  }

  private close(): void {
    this.notificationService.closeNotificationImmediately();
  }

}

