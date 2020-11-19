import {
  Component, Type, OnDestroy, AfterViewInit, ComponentRef, ViewChild,
  ComponentFactoryResolver, ChangeDetectorRef
} from '@angular/core';
import {InsertionDirective} from "../services/insertion.directive";
import {Subject} from "rxjs";
import {DialogRef} from "../services/dialog-ref";

@Component({
  selector: 'app-dialog',
  template: `
  <div class="overlay" (click)="onOverlayClicked($event)">
    <div class="dialog" (click)="onDialogClicked($event)">
      <ng-template appInsertion> </ng-template>
    </div>
  </div>
  `
})
export class AppDialogComponent implements AfterViewInit, OnDestroy {

  private readonly _onClose = new Subject<any>();
  public onClose = this._onClose.asObservable();

  public componentRef: ComponentRef<any>;

  @ViewChild(InsertionDirective)
  insertionPoint: InsertionDirective;
  childComponentType: Type<any>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private cd: ChangeDetectorRef,
              private dialogRef: DialogRef) {}

  ngAfterViewInit() {
    this.loadChildComponent(this.childComponentType);
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  onOverlayClicked(evt: MouseEvent) {
    this.dialogRef.close();
  }

  onDialogClicked(evt: MouseEvent) {
    evt.stopPropagation();
  }

  loadChildComponent(componentType: Type<any>) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);

    const viewContainerRef = this.insertionPoint.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
  }

  close() {
    this._onClose.next();
  }
}
