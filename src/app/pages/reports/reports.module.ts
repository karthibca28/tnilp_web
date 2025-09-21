import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ReportsComponent } from './reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonHeaderModule } from 'src/app/shared/components/common-header/common-header.module';
import { MasterDataService } from 'src/app/shared/service/master-data.service';

const routes: Routes = [
  { path: '', component: ReportsComponent }
];

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    CommonHeaderModule
  ],
  providers: [
    MasterDataService
  ]
})
export class ReportsModule { }
