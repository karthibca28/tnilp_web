import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// Auth
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { AuthenticationGuard } from './shared/service/authentication.guard';
import { Page500Component } from './shared/component/page-500/page-500.component';
import { Page404Component } from './shared/component/page-404/page-404.component';

const routes: Routes = [
  { path: '', redirectTo: "login", pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'login/:id', component: LoginComponent },
  
  // Main dashboard (no sidebar)
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard] },
  
  // Survey dashboard (no sidebar)
  { path: 'survey-dashboard', loadChildren: () => import('./pages/survey-dashboard/survey-dashboard.module').then(m => m.SurveyDashboardModule), canActivate: [AuthenticationGuard] },
  { path: 'survey-users', loadChildren: () => import('./pages/survey-users/survey-users.module').then(m => m.SurveyUsersModule), canActivate: [AuthenticationGuard] },
  { path: 'pat-indicator', loadChildren: () => import('./pages/pat-indicator/pat-indicator.module').then(m => m.PatIndicatorModule), canActivate: [AuthenticationGuard] },
  { path: 'user-master', loadChildren: () => import('./pages/user-master/user-master.module').then(m => m.UserMasterModule), canActivate: [AuthenticationGuard] },
  { path: 'survey-results', loadChildren: () => import('./pages/survey-results/survey-results.module').then(m => m.SurveyResultsModule), canActivate: [AuthenticationGuard] },
  { path: 'reports', loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule), canActivate: [AuthenticationGuard] },
  { path: 'mis-report', loadChildren: () => import('./pages/mis-report/mis-report.module').then(m => m.MisReportModule), canActivate: [AuthenticationGuard] },
  { path: 'pds-details', loadChildren: () => import('./pages/pds-details/pds-details.module').then(m => m.PdsDetailsModule), canActivate: [AuthenticationGuard] },
  { path: 'household-list', loadChildren: () => import('./pages/household-list/household-list.module').then(m => m.HouseholdListModule), canActivate: [AuthenticationGuard] },
  
  // Error pages (no layout)
  { path: '500', component: Page500Component },
  { path: '404', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
