import { Routes } from '@angular/router';
import { AppLoginComponent } from '../../modules/login/components/login.component';
import { AppRegisterComponent } from '../../modules/login/components/register.component';


export const AUTH_ROUTING: Routes = [
  {path: 'login', component: AppLoginComponent},
  {path: 'register', component: AppRegisterComponent},
];
