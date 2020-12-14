import {Routes} from '@angular/router';

import {AuthGuard} from '../guards/auth-guard';
import {AppEventsComponent} from '../../modules/events/components/events.component';



export const EVENTS_ROUTING: Routes = [
  {path: 'events', component: AppEventsComponent, canActivate: [AuthGuard]},
  {path: 'events/:id', component: AppEventsComponent, canActivate: [AuthGuard]},
];

