import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Rest} from "../../../core/rest/rest.service";
import {DialogService} from "../../../shared/modal/services/dialog-service";
import {takeUntil} from "rxjs/internal/operators";
import {ReplaySubject} from "rxjs";
import {LoaderService} from "../../../shared/loader/services/loader.service";
import {NotificationService} from "../../../shared/notification/services/notification.service";
import {Router} from "@angular/router";
import {User} from "../../../core/classes/user";

@Component({
  selector: 'app-users',
  template: `
    <div style="text-align: center">
      <h1 class="background-easy-green">
        Welcome to Users control page!
      </h1>
      <div class="container">
        <nav>
          <div class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <button type="button" class="btn btn-primary" (click)="goToCreateUser()">Add</button>
            <button type="button" class="btn btn-outline-primary ml-2" (click)="goBack()">Back</button>
          </div>
        </nav>
        <app-grid [tableHeaders]="getTableHeaders()"
                  [gridRows]="usersRender"
                  (clickEvent)="goToEditUser($event)"
                  (deleteEvent)="deleteUser($event)"></app-grid>
      </div>
    </div>
  `
})
export class AppUsersComponent implements OnInit {

  private users: User [] = [];
  private readonly destroyed$ = new ReplaySubject<void>(1);
  private usersRender = [];

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
    this.users = await this.rest.get('/users/all', true).then(res => res);
    this.users = this.users.map(post => new User(post));
    if (this.users) {
      this.setRenderUsers();
      this.loader.removeLoader();
    }
  }

  private async deletePost(event) {

  }


  private setRenderUsers(): void {
    this.usersRender = this.users.map((user, index, array) => {
      return {
        1: ['Delete'],
        2: user.email,
        3: user.username,
        4: user.created_at,
      };
    });
  }


  private getTableHeaders(): {} {
    return {
      1: 'Actions',
      2: 'Email',
      3: 'Username',
      4: 'Created At'
    };
  }

  private goToCreateUser(): void {
    this.router.navigate(['posts/create']);
  }

  private goToEditUser(event): void {
    this.router.navigate([`posts/edit/${this.users[event].id}`]);
  }

  private removeUser(id: number): void {

  }

  private goBack(): void {
    this.router.navigate(['']);
  }

}

