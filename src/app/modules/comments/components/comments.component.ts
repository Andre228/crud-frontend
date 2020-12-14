import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {Rest} from "../../../core/rest/rest.service";
import {DialogService} from "../../../shared/modal/services/dialog-service";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {NotificationService} from "../../../shared/notification/services/notification.service";
import {Post} from "../../../core/classes/post";
import {Router} from "@angular/router";
import {UserComment} from "../../../core/classes/user-comment";
import {User} from "../../../core/classes/user";

@Component({
  selector: 'app-comments',
  template: `
    <div *ngIf="comments.length > 0">
        <div *ngFor="let comment of commentsRender">
          <div class="alert alert-primary alert-dismissible fade show">
            <strong>{{ comment.created_at | date:'HH:mm:ss dd.MM.yyyy' }}</strong><br><hr>
            {{ comment.text }}
            <input class="comment-checkbox" type="checkbox" (change)="startChecking($event)" [(ngModel)]="comment.isSelected">
            <button type="button" class="close" (click)="deleteComment(comment.id)">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
    </div>
    <div class="justify-column">
      <div class="justify-flex mb-2">
         <div class="comment-save">
           <h5 class="card-title">Type your comment</h5>
         </div>
         <div class="comment-select-all">
           <h5 class="card-title">Select all</h5>
           <input class="comment-select-all-checkbox" type="checkbox" (click)="selectAll()">
         </div>
      </div>
      <textarea type="text" class="form-control" [(ngModel)]="text"></textarea>
      <div class="justify-flex">
        <button type="button" class="btn btn-primary m-t-1 fit-c-btn" (click)="saveComment()">Save</button>
        <button *ngIf="isSelectAll || startSelecting" type="button" class="btn btn-outline-danger m-t-1 fit-c-btn" (click)="deleteSelected()">Delete all</button>
      </div>
    </div>
  `
})
export class AppCommentsComponent implements OnInit {

  @Input() postId: number = null;
  @Input() user: User = null;
  @Input() post: Post = null;

  private comments: UserComment [] = [];
  private commentsRender = [];
  private comment: UserComment;

  private text: string = '';

  private isSelectAll: boolean = false;
  private startSelecting: boolean = false;

  constructor(private rest: Rest,
              private dialog: DialogService,
              private viewContainerRef: ViewContainerRef,
              private router: Router,
              private loader: LoaderService,
              private notification: NotificationService) {
    this.notification.containerRef = this.viewContainerRef;
  }

  async ngOnInit() {
    this.loader.runLoader(this.viewContainerRef);
    this.comments = await this.rest.get(`/comments/all/${this.post.id}`, true);
    this.setCommentsRender();
    this.loader.removeLoader();
  }

  private setCommentsRender(): void {
    this.commentsRender = this.comments.map(comment => {
      return {
        id: comment.id,
        text: comment.text,
        created_at: comment.created_at,
        user: comment.user,
        post: comment.post,
        isSelected: false
      };
    });
  }

  private startChecking(): void {
    this.startSelecting = this.commentsRender.some(item => item.isSelected);
  }

  private async saveComment() {

    let comment = new UserComment();
    comment.text = this.text;
    comment.created_at = new Date();
    comment.user = this.user;
    comment.post = this.post;

    // let dateNow = new Date();
    // comment.created_at = new Date(Date.UTC(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(),
    //   dateNow.getHours(), dateNow.getMinutes(), dateNow.getSeconds()));

    let notify = { message: '', class: '' };

    this.loader.runLoader(this.viewContainerRef);
    this.comment = await this.rest.post('/comments/create', comment, true).then(response => {
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
    if (this.comment) {
      this.comments.push(this.comment);
      this.setCommentsRender();
    }
    this.afterRequest(notify);
  }

  private async deleteComment(id: number) {
    if (id.toString().trim() !== '') {
      this.loader.runLoader(this.viewContainerRef);
      let notify = { message: '', class: '' };
      const isDeleted = await this.rest.delete(`/comments/delete/${id}`, true).then(response => {
        if (response) {
          notify = {
            message: 'Successfully deleted',
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
      if (isDeleted) {
        this.removeComment(id);
      }
      this.afterRequest(notify);
    }
  }

  private removeComment(id: number): void {
    this.comments.forEach((comment, index, array) => {
      if (comment.id === id) {
        array.splice(index, 1);
      }
    });
  }

  private afterRequest(notify: {}): void {
    this.loader.removeLoader();
    this.notification.showNotification(notify);
    this.notification.closeNotification();
  }

  private selectAll(): void {
    this.isSelectAll = !this.isSelectAll;
    this.commentsRender.forEach(item => item.isSelected = this.isSelectAll);
  }

  private async deleteSelected() {

    let ids = this.commentsRender.reduce((results, item) => {
      if (item.isSelected) results.push({
        id: item.id,
        text: item.text,
        created_at: item.created_at,
        user: item.user,
        post: item.post,
      });
      return results;
    }, []);

    let response = await this.rest.post(`/comments/delete/selected`, ids, true).then(res => res);

  }

}

