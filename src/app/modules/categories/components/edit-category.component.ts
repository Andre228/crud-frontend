import {Component, ComponentRef, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Rest} from "../../../core/rest/rest.service";
import {DialogConfig} from "../../../shared/modal/services/dialog-config";
import {DialogService} from "../../../shared/modal/services/dialog-service";
import {DialogRef} from "../../../shared/modal/services/dialog-ref";
import {Category} from "./categories.component";

@Component({
  selector: 'app-edit-category',
  template: `
      <div class="container">
        <div class="card">
          <div class="card-header">
            Edit you category
          </div>
          <div class="card-body">
            <h5 class="card-title">Slug</h5>
              <input type="text" class="form-control" id="slug" [(ngModel)]="categoryInfo.slug">
          </div>
        </div>
        <div class="justify-flex">
          <button type="button" class="btn btn-primary m-t-1 m-l-2">Save</button>
          <button type="button" class="btn btn-danger m-t-1 m-r-2" (click)="onClose()">Close</button>
        </div>
      </div>
  `
})
export class AppEditCategoryComponent implements OnInit {

  private categoryInfo: Category;

  constructor(private config: DialogConfig,
              private dialogRef: DialogRef) {}

  ngOnInit() {

    if (this.config && this.config.data && this.config.data.categoryInfo) {
      this.categoryInfo = this.config.data.categoryInfo;
    }
  }

  onClose() {
    this.dialogRef.close('some value');
  }

}
