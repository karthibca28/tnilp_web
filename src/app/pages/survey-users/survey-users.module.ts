import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SurveyUsersComponent } from './survey-users.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserService } from 'src/app/shared/service/user.service';
import { CommonHeaderModule } from 'src/app/shared/components/common-header/common-header.module';

const routes: Routes = [
  { path: '', component: SurveyUsersComponent }
];

@NgModule({
  declarations: [
    SurveyUsersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    CommonHeaderModule
  ],
  providers: [
    UserService
  ]
})
export class SurveyUsersModule { }
