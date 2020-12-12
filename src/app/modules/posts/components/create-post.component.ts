import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {DialogConfig} from "../../../shared/modal/services/dialog-config";
import {DialogRef} from "../../../shared/modal/services/dialog-ref";
import {Category} from "../../../core/classes/category";
import {Rest} from "../../../core/rest/rest.service";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {NotificationService} from "../../../shared/notification/services/notification.service";
import {Post} from "../../../core/classes/post";
import {AuthService} from "../../login/services/auth.service";
import {User} from "../../../core/classes/user";
import {reject} from "q";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from "@angular/common/http";
import {APP_HOST} from "../../../core/config";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-post',
  template: `
      <div class="container mt-5">
        <div class="card">
          <div class="card-header justify-flex">
            <span>Create you post</span>
          </div>
          <div class="card-body">
          <form [formGroup]="formData" (submit)="createNewPost($event)" enctype="multipart/form-data">
            <div>
              <h5 class="card-title">Title</h5>
              <input formControlName="title" type="text" name="title" class="form-control" maxlength="100">
            </div>
            <div>
              <h5 class="card-title">Description</h5>
              <input formControlName="description" type="text" name="description" required class="form-control" >
            </div>
            <div>
              <h5 class="card-title">Slug</h5>
              <input formControlName="slug" type="text" class="form-control" maxlength="255">
            </div>
            <div>
              <h5 class="card-title">Excerpt</h5>
              <input formControlName="excerpt" type="text" class="form-control" maxlength="255">
            </div>
            <div>
              <h5 class="card-title">Categories</h5>
              <select formControlName="selectedCategory" [(ngModel)]="selectedCategory" class="custom-select">
                <option *ngFor="let category of categories" [ngValue]="category">{{ category.title }}</option>
              </select>
            </div>
            <div>
             <div class="input-group mt-3">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <input formControlName="is_published" type="checkbox">
                  </div>
                  <h5 class="card-title ml-2">Published it?</h5>
                </div>
              </div>
            </div>
            <div>
              <div class="input-group">
                <div class="custom-file">
                  <input formControlName="file" (change)="fileChange($event)" type="file" name="file" class="custom-file-input">
                  <label class="custom-file-label" for="inputGroupFile04">Choose file</label>
                </div>
                <div class="input-group-append">
                  <button class="btn btn-outline-primary" type="button">Save image</button>
                </div>
              </div>
            </div>
            <div class="justify-flex-reverse">
              <button type="submit" class="btn btn-primary m-t-1 m-l-2" [disabled]="!formData.valid">Create</button>
              <button type="button" class="btn btn-outline-primary m-t-1" (click)="goBack()">Back</button>
            </div>
            </form>
          </div>
        </div>
      </div>
  `
})
export class AppCreatePostComponent implements OnInit {

  private post = new Post();
  private formData: FormGroup;

  private categories = [];
  private selectedCategory: Category;
  private user: User;
  private file;

  constructor(private rest: Rest,
              private auth: AuthService,
              private viewContainerRef: ViewContainerRef,
              private router: Router,
              private httpClient: HttpClient,
              private loader: LoaderService,
              private notification: NotificationService) {

    this.notification.containerRef = this.viewContainerRef;

    this.formData = new FormGroup({
      title : new FormControl('', Validators.required),
      description : new FormControl('', Validators.required),
      slug : new FormControl('', Validators.required),
      excerpt : new FormControl('', Validators.required),
      is_published : new FormControl(false),
      selectedCategory: new FormControl(),
      file: new FormControl()
    });

  }

  async ngOnInit() {
    this.loader.runLoader(this.viewContainerRef);
    this.categories = await this.rest.get('/categories/all', true).then(res => res);
    if (this.categories) {
      this.selectedCategory = this.categories[0];
    }
    this.user = await this.auth.getUser();
    this.loader.removeLoader();
  }

  fileChange(event): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
    }
  }

  private async createNewPost() {

    let body = new FormData();
    let isFileUploading = false;
    body.append('title', this.formData.value.title);
    body.append('description', this.formData.value.description);
    body.append('slug', this.formData.value.slug);
    body.append('excerpt', this.formData.value.excerpt);
    body.append('is_published', this.formData.value.is_published);
    body.append('user', this.user.id.toString());
    body.append('category', this.formData.value.selectedCategory['id'].toString());
    //body.append('file', this.file, this.file.name);
    if (this.file) {
      isFileUploading = true;
      body.append('isFileUploading', isFileUploading.toString());
      body.append('file', this.file, this.file.name);
    } else {
      isFileUploading = false;
      body.append('isFileUploading', isFileUploading.toString());
      body.append('file', new Blob(), 'none');
    }


    this.loader.runLoader(this.viewContainerRef, { message: 'Creating a new post, please wait...' });

    let notify = { message: '', class: '' };

    await this.rest.post(`/posts/create`, body, true, true).then(response => {
      if (response) {
        notify = {
          message: 'Successfully created',
          class: 'success-notify'
        };
      } else {
        Promise.reject('Unknown error');
      }
      return response;
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

  private goBack(): void {
    this.router.navigate(['posts']);
  }

}
