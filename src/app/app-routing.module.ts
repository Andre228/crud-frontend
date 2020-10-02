import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppLoginComponent} from "./modules/login/components/login.component";
import {AppRegisterComponent} from "./modules/login/components/register.component";
import {AppHomeComponent} from "./modules/home/components/home.component";

const routes: Routes = [

  {path: '', component: AppHomeComponent},
  {path: 'login', component: AppLoginComponent},
  {path: 'register', component: AppRegisterComponent},

  {path: '**', redirectTo: ''}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
