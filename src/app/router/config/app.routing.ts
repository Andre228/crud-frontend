import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AUTH_ROUTING } from './auth.routing';
import { AppHomeComponent } from '../../modules/home/components/home.component';
import {AuthGuard} from "../guards/auth-guard";
import {CATEGORIES_ROUTING} from "./categories.routing";


const routes: Routes = [
  {path: '', component: AppHomeComponent, canActivate: [AuthGuard]},
  ...AUTH_ROUTING,
  ...CATEGORIES_ROUTING,

  {path: '**', redirectTo: ''}
];


export const APP_ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);