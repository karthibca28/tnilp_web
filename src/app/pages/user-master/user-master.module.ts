import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { UserMasterComponent } from './user-master.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MasterDataService } from 'src/app/shared/service/master-data.service';
import { CommonHeaderModule } from 'src/app/shared/components/common-header/common-header.module';

const routes: Routes = [
  { path: '', component: UserMasterComponent }
];

@NgModule({
  declarations: [
    UserMasterComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CommonHeaderModule
  ],
  providers: [
    MasterDataService
  ]
})
export class UserMasterModule { }
