import {Component, ComponentFactoryResolver, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Rest} from "../../../core/rest/rest.service";
import {AppEditCategoryComponent} from "./edit-category.component";
import {DialogService} from "../../../shared/modal/services/dialog-service";
import {takeUntil} from "rxjs/internal/operators";
import {ReplaySubject} from "rxjs";

export interface Category {
  id: number;
  slug: string;
  description: string;
  parent_id: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  posts?: Array<{}>;
}

@Component({
  selector: 'app-categories',
  template: `
    <div style="text-align:center">
      <h1 class="background-easy-green">
        Welcome to Categories control page!
      </h1>
      <div>
        <app-grid [gridRows]="categories" (clickEvent)="openEditCategory($event)"></app-grid>
      </div>
    </div>
  `
})
export class AppCategoriesComponent implements OnInit, OnDestroy {

  private categories: Category [] = [];
  private readonly destroyed$ = new ReplaySubject<void>(1);

  constructor(private http: HttpClient, private rest: Rest,
              private componentFactoryResolver: ComponentFactoryResolver,
              public dialog: DialogService) {}

  async ngOnInit() {
    this.categories = await this.rest.get('/categories/all', true).then(res => res as Category []);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private openEditCategory(event) {
     // const el = this.componentFactoryResolver.resolveComponentFactory(AppEditCategoryComponent);

    console.log(event);

      const ref = this.dialog.open(AppEditCategoryComponent, {
        data: { categoryInfo: event },
      });

      ref.afterClosed.pipe(takeUntil(this.destroyed$)).subscribe(result => {
        console.log('Dialog closed', result);
      });
    }
  }

