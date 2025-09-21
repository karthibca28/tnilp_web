import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PatIndicatorComponent } from './pat-indicator.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonHeaderModule } from 'src/app/shared/components/common-header/common-header.module';

const routes: Routes = [
  { path: '', component: PatIndicatorComponent }
];

@NgModule({
  declarations: [
    PatIndicatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    CommonHeaderModule
  ]
})
export class PatIndicatorModule { }
