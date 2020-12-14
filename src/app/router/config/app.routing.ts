import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AUTH_ROUTING } from './auth.routing';
import { AppHomeComponent } from '../../modules/home/components/home.component';
import {AuthGuard} from "../guards/auth-guard";
import {CATEGORIES_ROUTING} from "./categories.routing";
import {POSTS_ROUTING} from "./posts.routing";
import {USERS_ROUTING} from "./users.routing";
import {EVENTS_ROUTING} from "./events.routing";
import {TOURS_ROUTING} from "./tours.routing";


const routes: Routes = [
  {path: '', component: AppHomeComponent, canActivate: [AuthGuard]},
  ...AUTH_ROUTING,
  ...CATEGORIES_ROUTING,
  ...EVENTS_ROUTING,
  ...POSTS_ROUTING,
  ...USERS_ROUTING,
  ...TOURS_ROUTING,

  {path: '**', redirectTo: ''}
];


export const APP_ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);
