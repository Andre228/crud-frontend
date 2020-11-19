import {
  Injectable,
  ComponentFactoryResolver,
  ComponentRef, ViewContainerRef,
} from '@angular/core';
import {AppLoaderComponent} from "../components/loader.component";

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private viewContainerRef: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  runLoader(viewContainer: ViewContainerRef, data?: {}) {
    this.viewContainerRef = viewContainer;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AppLoaderComponent);
    this.viewContainerRef.clear();
    this.componentRef = this.viewContainerRef.createComponent<AppLoaderComponent>(componentFactory);
    this.componentRef.instance.data = data;
  }

  removeLoader() {
    this.viewContainerRef.detach(0);
  }

}
