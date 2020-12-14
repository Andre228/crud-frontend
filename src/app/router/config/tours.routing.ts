import {Routes} from '@angular/router';

import {AuthGuard} from '../guards/auth-guard';
import {AppToursComponent} from "../../modules/tours/components/tours.component";



export const TOURS_ROUTING: Routes = [
  {path: 'tours', component: AppToursComponent, canActivate: [AuthGuard]},
  {path: 'tours/:id', component: AppToursComponent, canActivate: [AuthGuard]},
];

