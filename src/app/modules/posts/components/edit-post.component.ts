import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Category} from "../../../core/classes/category";
import {Rest} from "../../../core/rest/rest.service";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {NotificationService} from "../../../shared/notification/services/notification.service";
import {Post} from "../../../core/classes/post";
import {AuthService} from "../../login/services/auth.service";
import {User} from "../../../core/classes/user";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {APP_HOST} from "../../../core/config";

@Component({
  selector: 'app-edit-post',
  template: `
      <div class="container mt-5 m-b-15">
        <div class="card">
          <div class="card-header justify-flex">
            <span>Edit you post</span>
          </div>
          <div class="card-body">
          <form [formGroup]="formData" (submit)="save($event)" enctype="multipart/form-data">
            <div>
              <h5 class="card-title">Title</h5>
              <input formControlName="title" type="text" name="title" class="form-control" maxlength="100">
            </div>
            <div>
              <h5 class="card-title">Description</h5>
              <textarea formControlName="description" type="text" name="description" required class="form-control" ></textarea>
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
                <option *ngFor="let category of categoriesForSelect" [ngValue]="category">{{ category }}</option>
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
            <div class="mt-2">
              <img id="image" width="1068" height="700" [src]="sanitizedUrl"/>
            </div>
            <div class="mt-2">
              <div class="input-group justify-flex-reverse">
                <div class="">
                  <input formControlName="file" (change)="fileChange($event)" type="file" name="file">
                </div>
                <div class="justify-flex-reverse">
                  <button type="button" class="btn btn-outline-primary ml-2" (click)="goBack()">Back</button>
                  <button type="submit" class="btn btn-primary m-t-1 m-l-2" [disabled]="!formData.valid">Save</button>
                </div>
              </div>
            </div>
            </form>
          </div>
        </div>
        <button class="btn btn-outline-primary mt-2" (click)="loadComments($event)">Show Comments</button>
        <div class="mt-2" *ngIf="showComments">
          <app-comments
              [postId]="post.id"
              [user]="user"
              [post]="post"></app-comments>
        </div>
      </div>
  `
})
export class AppEditPostComponent implements OnInit {

  private post = new Post();
  private formData: FormGroup;

  private categories: Category [] = [];

  private categoriesForSelect: string [] = [];
  private selectedCategory: string;

  private user: User;
  private file;
  private sanitizedUrl;
  private blob: Blob;

  private showComments: boolean = false;

  constructor(private rest: Rest,
              private auth: AuthService,
              private viewContainerRef: ViewContainerRef,
              private activateRoute: ActivatedRoute,
              private sanitizer: DomSanitizer,
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
    this.categoriesForSelect = this.categories.map(category => category['title']);

    this.user = await this.auth.getUser();

    let id = this.activateRoute.snapshot.params['id'];
    this.post = await this.rest.get(`/posts/get/${id}`, true);

    this.setFormGroup();
    await this.image();
    console.log(this.post);

    this.loader.removeLoader();
  }

  fileChange(event): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
    }
  }

  async image() {
    let id = this.activateRoute.snapshot.params['id'];
    await this.rest.get(`/get-image/${id}`, true, true).then(res => {

      this.blob = new Blob([res], { type: 'image/png' });

      const urlCreator = window.URL;
      const imageUrl = urlCreator.createObjectURL(res);
      this.sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);

    });
  }

  private async save() {

    let body = new FormData();
    let updateFile = false;
    body.append('id', this.post.id.toString());
    body.append('title', this.formData.value.title);
    body.append('description', this.formData.value.description);
    body.append('slug', this.formData.value.slug);
    body.append('excerpt', this.formData.value.excerpt);
    body.append('is_published', this.formData.value.is_published);
    body.append('user', this.user.id.toString());
    body.append('alias', this.post.alias);
    body.append('category', this.categories.find(category => category['title'] === this.selectedCategory)['id'].toString());
    if (this.file) {
      updateFile = true;
      body.append('isUpdatingFile', updateFile.toString());
      body.append('file', this.file, this.file.name);
    } else {
      updateFile = false;
      body.append('isUpdatingFile', updateFile.toString());
      body.append('file', this.blob, 'none');
    }


    this.loader.runLoader(this.viewContainerRef, { message: 'Creating a new post, please wait...' });

    let notify = { message: '', class: '' };

    await this.rest.put(`/posts/update`, body, true, true).then(response => {
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

  private setFormGroup(): void {
    if (this.post) {
      this.selectedCategory = this.post.category['title'];
      this.formData = new FormGroup({
        title : new FormControl(this.post.title, Validators.required),
        description : new FormControl(this.post.description, Validators.required),
        slug : new FormControl(this.post.slug, Validators.required),
        excerpt : new FormControl(this.post.excerpt, Validators.required),
        is_published : new FormControl(this.post.is_published),
        selectedCategory: new FormControl(this.selectedCategory),
        file: new FormControl()
      });
    }

  }

  private goBack(): void {
    this.router.navigate(['posts']);
  }

  private loadComments(): void {
    this.showComments = !this.showComments;
  }

}
