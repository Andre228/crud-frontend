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
import {Router} from "@angular/router";

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
            <button type="button" class="btn btn-outline-primary ml-2" (click)="goBack()">Back</button>
          </div>
        </nav>
        <span class="justify-center">
          <app-grid [tableHeaders]="getTableHeaders()"
                    [gridRows]="categoriesRender"
                    (clickEvent)="openEditCategory($event)"
                    (deleteEvent)="deleteCategory($event)"></app-grid>
        </span>
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
              private router: Router,
              private loader: LoaderService,
              private notification: NotificationService) {
    this.notification.containerRef = this.viewContainerRef;
  }

  ngOnChanges() {
    this.setRenderCategories();
  }

  async ngOnInit() {
    this.loader.runLoader(this.viewContainerRef);
    this.categories = await this.rest.get('/categories/all', true);
    this.categories = this.categories.map(category => new Category(category));
    if (this.categories) {
      this.setRenderCategories();
      this.loader.removeLoader();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(null);
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
        if (result) {
          this.categories[event] = new Category(result);
          this.setRenderCategories();
        }
      });
    }
  }

  private async deleteCategory(event) {
    this.loader.runLoader(this.viewContainerRef);
    const id = this.categories[event].getId();
    const url = `/categories/delete/${id}`;
    let notify = { message: '', class: '' };
    await this.rest.delete(url, true).then(response => {
      if (response) {
        this.removeCategory(id);
        this.setRenderCategories();
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

  private setRenderCategories(): void {
    this.categoriesRender = this.categories.map((category, index, array) => {
      return {
        control: ['Delete'],
        title: category['title'],
        slug: category['slug'],
        description: category['description'],
        parentId: array.find(item => item.getId() === category.getParentId()).getTitle(),
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

  private goBack(): void {
    this.router.navigate(['']);
  }

}

