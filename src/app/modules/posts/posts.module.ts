import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HttpClient, HttpClientModule} from "@angular/common/http";
import {SharedModule} from "../../shared/shared.module";
import {AppPostsComponent} from "./components/posts.component";
import {AppCreatePostComponent} from "./components/create-post.component";
import {ReactiveFormsModule} from "@angular/forms";
import {AppEditPostComponent} from "./components/edit-post.component";
import {AppCommentsComponent} from "../comments/components/comments.component";
import {CommentsModule} from "../comments/comments.module";
import {AppCreateEventComponent} from "../events/components/create-event.component";

@NgModule({
  declarations: [
    AppCommentsComponent,
    AppPostsComponent,
    AppCreatePostComponent,
    AppEditPostComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    AppCreateEventComponent
  ],
  providers: [HttpClient],
  bootstrap: []
})
export class PostsModule { }

