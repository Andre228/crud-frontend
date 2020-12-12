import {AppUsersComponent} from '../../modules/users/components/users.component';

import {Routes} from '@angular/router';
import {AuthGuard} from '../guards/auth-guard';


export const USERS_ROUTING: Routes = [
  {path: 'users', component: AppUsersComponent, canActivate: [AuthGuard]},
];

