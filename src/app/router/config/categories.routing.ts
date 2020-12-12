import {Routes} from '@angular/router';

import {AppCategoriesComponent} from '../../modules/categories/components/categories.component';
import {AuthGuard} from '../guards/auth-guard';


export const CATEGORIES_ROUTING: Routes = [
  {path: 'categories', component: AppCategoriesComponent, canActivate: [AuthGuard]}
];

