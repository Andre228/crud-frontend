import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
  ComponentRef, Type, ViewContainerRef,
} from '@angular/core';
import {AppNotificationComponent} from "../components/notification.component";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private componentRef: ComponentRef<any>;
  private viewContainerRef: ViewContainerRef;

  private readonly notificationLifeCycle = 4000;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  set containerRef(value) {
    this.viewContainerRef = value;
  }

  showNotification(data?: {}) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AppNotificationComponent);
    this.viewContainerRef.clear();
    this.componentRef = this.viewContainerRef.createComponent<AppNotificationComponent>(componentFactory);
    this.componentRef.instance.data = data;

  }

  closeNotification() {
    setTimeout(() => {
      this.viewContainerRef.detach(0);
    }, this.notificationLifeCycle);
  }

  closeNotificationImmediately(): void {
    if (this.viewContainerRef) {
      this.viewContainerRef.detach(0);
    }
  }

  getNotificationLifeCycle(): number {
    return this.notificationLifeCycle;
  }

}
