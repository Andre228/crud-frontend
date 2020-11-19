import {Component, OnChanges, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {Rest} from "../../../core/rest/rest.service";
import {AppEditCategoryComponent} from "./edit-category.component";
import {DialogService} from "../../../shared/modal/services/dialog-service";
import {takeUntil} from "rxjs/internal/operators";
import {ReplaySubject} from "rxjs";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {AppCreateCategoryComponent} from "./create-category.component";
import {Category} from "../../../core/classes/category";
import {NotificationService} from "../../../shared/notification/services/notification.service";

@Component({
  selector: 'app-categories',
  template: `
    <div style="text-align: center">
      <h1 class="background-easy-green">
        Welcome to Categories control page!
      </h1>
      <div class="container">
        <nav>
          <div class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <button type="button" class="btn btn-primary" (click)="openCreateCategory($event)">Add</button>
          </div>
        </nav>
        <app-grid [tableHeaders]="getTableHeaders()"
                  [gridRows]="categoriesRender"
                  (clickEvent)="openEditCategory($event)"
                  (deleteEvent)="deleteCategory($event)"></app-grid>
      </div>
    </div>
  `
})
export class AppCategoriesComponent implements OnInit, OnDestroy, OnChanges {

  private categories: Category [] = [];
  private readonly destroyed$ = new ReplaySubject<void>(1);
  private categoriesRender = [];

  constructor(private rest: Rest,
              public dialog: DialogService,
              private viewContainerRef: ViewContainerRef,
              private loader: LoaderService,
              private notification: NotificationService) {
    this.notification.containerRef = this.viewContainerRef;
  }

  ngOnChanges() {
    this.setRenderCategories();
  }

  async ngOnInit() {
    this.loader.runLoader(this.viewContainerRef);
    this.categories = await this.rest.get('/categories/all', true).then(res => res);
    this.categories = this.categories.map(category => new Category(category));
    if (this.categories) {
      this.setRenderCategories();
      this.loader.removeLoader();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private openCreateCategory(event): void {
    const ref = this.dialog.open(AppCreateCategoryComponent, {
      data: { categoryInfo: null, viewContainerRef: this.viewContainerRef },
    });
    ref.afterClosed.pipe(takeUntil(this.destroyed$)).subscribe(result => {
      if (result) {
        this.categories.push(new Category(result));
        this.setRenderCategories();
      }
    });
  }

  private openEditCategory(event): void {
    if (event !== null || event !== undefined) {
      const updatingCategory = this.categories[event];
      const ref = this.dialog.open(AppEditCategoryComponent, {
        data: { categoryInfo: updatingCategory, listCategories: this.categories },
      });
      ref.afterClosed.pipe(takeUntil(this.destroyed$)).subscribe(result => {
        console.log('Dialog closed', result);
      });
    }
  }

  private async deleteCategory(event) {
    this.loader.runLoader(this.viewContainerRef);
    console.log(this.categories[event]);
    const id = this.categories[event].getId();
    const url = `/categories/delete/${id}`;
    const checkDeleting = await this.rest.delete(url, true);
    if (checkDeleting) {
      this.removeCategory(id);
      this.setRenderCategories();
      this.notification.showNotification({ message: 'Successfully deleted' });
      this.notification.closeNotification();
    }
    this.loader.removeLoader();
  }

  private setRenderCategories(): void {
    this.categoriesRender = this.categories.map((category) => {
      return {
        control: ['Delete'],
        title: category['title'],
        slug: category['slug'],
        description: category['description'],
        parentId: category['parentId'],
        createdAt: category['createdAt']
      };
    });
  }

  private getTableHeaders(): {} {
    return {
      control: 'Actions',
      title: 'Title',
      slug: 'Slug',
      description: 'Description',
      parentId: 'Parent category',
      createdAt: 'Create date',
    };
  }

  private removeCategory(id: number): void {
    this.categories.forEach((category, index, array) => {
      if (category.getId() === id) {
        array.splice(index, 1);
      }
    });
  }

}

