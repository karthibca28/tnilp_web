import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SurveyDashboardComponent } from './survey-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PatIndicatorService } from 'src/app/shared/service/pat-indicator.service';
import { CommonHeaderModule } from 'src/app/shared/components/common-header/common-header.module';

const routes: Routes = [
  { path: '', component: SurveyDashboardComponent }
];

@NgModule({
  declarations: [
    SurveyDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CommonHeaderModule
  ],
  providers: [
    PatIndicatorService
  ]
})
export class SurveyDashboardModule { }
