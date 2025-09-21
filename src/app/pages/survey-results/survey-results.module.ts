import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SurveyResultsComponent } from './survey-results.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonHeaderModule } from 'src/app/shared/components/common-header/common-header.module';

const routes: Routes = [
  { path: '', component: SurveyResultsComponent }
];

@NgModule({
  declarations: [
    SurveyResultsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    CommonHeaderModule
  ]
})
export class SurveyResultsModule { }
