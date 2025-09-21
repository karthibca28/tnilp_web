import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MisReportComponent } from './mis-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonHeaderModule } from 'src/app/shared/components/common-header/common-header.module';
import { MasterDataService } from 'src/app/shared/service/master-data.service';
import { MisReportService } from 'src/app/shared/service/mis-report.service';

const routes: Routes = [
  { path: '', component: MisReportComponent }
];

@NgModule({
  declarations: [
    MisReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    CommonHeaderModule
  ],
  providers: [
    MasterDataService,
    MisReportService
  ]
})
export class MisReportModule { }
