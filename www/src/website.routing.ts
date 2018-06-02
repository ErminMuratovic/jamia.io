import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from "./login/login.component";
import {ImpressumComponent} from "./impressum/impressum.component";

import {AuthGuard} from "./_guards/auth.guard";
import {AdminGuard} from "./_guards/admin.guard";
import {LoginGuard} from "./_guards/login.guard";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {MembersComponent} from "./dashboard/members/members.component";
import {AccountingComponent} from "./dashboard/accounting/accounting.component";

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'dashboard/members', component: MembersComponent, canActivate: [AuthGuard]},
  {path: 'dashboard/accounting', component: AccountingComponent, canActivate: [AuthGuard]},
//    {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  {path: 'impressum', component: ImpressumComponent},
  {path: '**', redirectTo: ''}
];

const routing = RouterModule.forRoot(appRoutes);

export {routing};
