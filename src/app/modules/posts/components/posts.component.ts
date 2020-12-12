import {Component, OnChanges, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {Rest} from "../../../core/rest/rest.service";
import {DialogService} from "../../../shared/modal/services/dialog-service";
import {takeUntil} from "rxjs/internal/operators";
import {ReplaySubject} from "rxjs";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {Category} from "../../../core/classes/category";
import {NotificationService} from "../../../shared/notification/services/notification.service";
import {Post} from "../../../core/classes/post";
import {Router} from "@angular/router";

@Component({
  selector: 'app-posts',
  template: `
    <div style="text-align: center">
      <h1 class="background-easy-green">
        Welcome to Post control page!
      </h1>
      <div class="container">
        <nav>
          <div class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <button type="button" class="btn btn-primary" (click)="goToCreatePost()">Add</button>
            <button type="button" class="btn btn-outline-primary ml-2" (click)="goBack()">Back</button>
          </div>
        </nav>
        <app-grid [tableHeaders]="getTableHeaders()"
                  [gridRows]="postsRender"
                  (clickEvent)="goToEditPost($event)"
                  (deleteEvent)="deletePost($event)"></app-grid>
      </div>
    </div>
  `
})
export class AppPostsComponent implements OnInit {

  private posts: Post [] = [];
  private readonly destroyed$ = new ReplaySubject<void>(1);
  private postsRender = [];

  constructor(private rest: Rest,
              public dialog: DialogService,
              private viewContainerRef: ViewContainerRef,
              private router: Router,
              private loader: LoaderService,
              private notification: NotificationService) {
    this.notification.containerRef = this.viewContainerRef;
  }

  async ngOnInit() {
    this.loader.runLoader(this.viewContainerRef);
    this.posts = await this.rest.get('/posts/all', true).then(res => res);
    this.posts = this.posts.map(post => new Post(post));
    if (this.posts) {
      this.setRenderPosts();
      this.loader.removeLoader();
    }
  }

  private async deletePost(event) {
    this.loader.runLoader(this.viewContainerRef);
    const id = this.posts[event].id;
    const url = `/posts/delete/${id}`;
    let notify = { message: '', class: '' };
    await this.rest.delete(url, true).then(response => {
      if (response) {
        this.removePost(id);
        this.setRenderPosts();
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


  private setRenderPosts(): void {
    this.postsRender = this.posts.map((post, index, array) => {
      return {
        1: ['Delete'],
        2: post.title,
        3: post.slug,
        4: post.excerpt,
        5: post.publiched_at,
        6: post.description,
        7: post.category['title'],
        8: post.user.username
      };
    });
  }


  private getTableHeaders(): {} {
    return {
      1: 'Actions',
      2: 'Title',
      3: 'Slug',
      4: 'Excerpt',
      5: 'Publiched at',
      6: 'Description',
      7: 'Category',
      8: 'Author',
    };
  }

  private goToCreatePost(): void {
    this.router.navigate(['posts/create']);
  }

  private goToEditPost(event): void {
    this.router.navigate([`posts/edit/${this.posts[event].id}`]);
  }

  private removePost(id: number): void {
    this.posts.forEach((post, index, array) => {
      if (post.id === id) {
        array.splice(index, 1);
      }
    });
  }

  private goBack(): void {
    this.router.navigate(['']);
  }

}

