import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {DialogConfig} from "../../../shared/modal/services/dialog-config";
import {DialogRef} from "../../../shared/modal/services/dialog-ref";
import {Category} from "../../../core/classes/category";
import {Rest} from "../../../core/rest/rest.service";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {Router} from "@angular/router";
import {DialogService} from "../../../shared/modal/services/dialog-service";
import {ReplaySubject} from "rxjs";
import {AppCreateTourComponent} from "../../tours/components/create-tour.component";
import {takeUntil} from "rxjs/internal/operators";

@Component({
  selector: 'app-edit-category',
  template: `
      <div class="container">
        <div class="card">
          <div class="card-header justify-flex">
            <span>Edit you category</span>
            <button type="button" class="btn m-r-2" (click)="onClose()">X</button>
          </div>
          <div class="card-body">
            <div>
              <h5 class="card-title">Title</h5>
              <input type="text" class="form-control" [(ngModel)]="categoryInfo.title">
            </div>
            <div>
              <h5 class="card-title">Description</h5>
              <input type="text" class="form-control" [(ngModel)]="categoryInfo.description">
            </div>
            <div>
              <h5 class="card-title">Slug</h5>
              <input type="text" class="form-control" [(ngModel)]="categoryInfo.slug">
            </div>
            <div class="input-group mt-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">Parent category</label>
              </div>
              <select [(ngModel)]="selectedCategory" class="custom-select">
                <option *ngFor="let category of listCategories" [ngValue]="category">{{ category.title }}</option>
              </select>
            </div>
            <hr>
            <div class="justify-flex mt-2">
              <button type="button" class="btn btn-primary" (click)="updateCategory()">Save</button>
              <div>
                <button type="button" class="btn btn-primary mr-2" (click)="showTours()">Show tours</button>
                <button type="button" class="btn btn-primary" (click)="addTour()">Add tour</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  `
})
export class AppEditCategoryComponent implements OnInit, OnDestroy {

  private categoryInfo: Category;
  private listCategories: Category [] = [];
  private selectedCategory: Category;

  private readonly destroyed$ = new ReplaySubject<void>(1);

  constructor(private rest: Rest,
              private viewContainerRef: ViewContainerRef,
              private config: DialogConfig,
              private dialogRef: DialogRef,
              private loader: LoaderService,
              private dialog: DialogService,
              private router: Router) {}

  ngOnInit() {
    if (this.config && this.config.data && this.config.data.categoryInfo) {
      this.categoryInfo = this.config.data.categoryInfo;
      this.listCategories = this.config.data.listCategories;
      this.selectedCategory = this.listCategories.find(category => category.getId() === this.categoryInfo.getParentId());
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  private updateCategory(): void {
    this.loader.runLoader(this.viewContainerRef, { message: 'Updating a category, please wait...' });

    const now = new Date();
    const date = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

    this.categoryInfo.setParentId(this.selectedCategory.getId());
    this.categoryInfo.setUpdatedAt(date);


    this.rest.put('/categories/update', this.categoryInfo, true).then(res => {
      this.loader.removeLoader();
      this.dialogRef.close(res);
    });
  }

  private addTour(event) {
    this.dialogRef.close();
    const ref = this.dialog.open(AppCreateTourComponent, {
      data: { category: this.categoryInfo },
    });
    ref.afterClosed.pipe(takeUntil(this.destroyed$)).subscribe(result => {
      console.log(result);
    });
  }

  private showTours(): void {
    this.dialogRef.close();
    this.router.navigate([`tours/${this.categoryInfo.getId()}`]);
  }

}
