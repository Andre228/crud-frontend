import {Routes} from '@angular/router';

import {AppPostsComponent} from '../../modules/posts/components/posts.component';
import {AppCreatePostComponent} from '../../modules/posts/components/create-post.component';
import {AppEditPostComponent} from '../../modules/posts/components/edit-post.component';
import {AuthGuard} from '../guards/auth-guard';



export const POSTS_ROUTING: Routes = [
  {path: 'posts', component: AppPostsComponent, canActivate: [AuthGuard]},
  {path: 'posts/create', component: AppCreatePostComponent, canActivate: [AuthGuard]},
  {path: 'posts/edit/:id', component: AppEditPostComponent, canActivate: [AuthGuard]}
];

