import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {DialogConfig} from "../../../shared/modal/services/dialog-config";
import {DialogRef} from "../../../shared/modal/services/dialog-ref";
import {Category} from "../../../core/classes/category";
import {Rest} from "../../../core/rest/rest.service";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {NotificationService} from "../../../shared/notification/services/notification.service";

@Component({
  selector: 'app-create-category',
  template: `
      <div class="container">
        <div class="card">
          <div class="card-header justify-flex">
            <span>Create you category</span>
            <button type="button" class="btn m-r-2" (click)="onClose()">X</button>
          </div>
          <div class="card-body">
            <div>
              <h5 class="card-title">Title</h5>
              <input type="text" class="form-control" [(ngModel)]="category.title">
            </div>
            <div>
              <h5 class="card-title">Description</h5>
              <input type="text" class="form-control" [(ngModel)]="category.description">
            </div>
            <div>
              <h5 class="card-title">Slug</h5>
              <input type="text" class="form-control" [(ngModel)]="category.slug">
            </div>
            <div class="justify-flex-reverse">
              <button type="button" class="btn btn-primary m-t-1 m-l-2" (click)="createNewCategory($event)">Create</button>
            </div>
          </div>
        </div>
      </div>
  `
})
export class AppCreateCategoryComponent implements OnInit {

  private category = new Category();

  constructor(private rest: Rest,
              private viewContainerRefLoader: ViewContainerRef,
              private config: DialogConfig,
              private dialogRef: DialogRef,
              private loader: LoaderService,
              private notification: NotificationService) {}

  ngOnInit() {
    if (this.config && this.config.data && this.config.data.viewContainerRef) {
      this.notification.containerRef = this.config.data.viewContainerRef;
    }
  }

  onClose() {
    this.dialogRef.close('some value');
  }

  private createNewCategory(event): void {
    this.loader.runLoader(this.viewContainerRefLoader, { message: 'Creating a new category, please wait...' });

    if (!this.category.getParentId()) {
      this.category.setParentId(0);
    }
    const now = new Date();
    const date = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

    this.category.setCreatedAt(date);
    this.category.setUpdatedAt(date);
    console.log(this.category);

    this.rest.post('/categories/create', this.category, true).then(res => {
      this.loader.removeLoader();
      this.dialogRef.close(res);
      this.notification.showNotification({ message: 'Successfully created' });
      this.notification.closeNotification();
    });
  }

}
