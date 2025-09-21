import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HouseholdListComponent } from './household-list.component';
import { CommonHeaderModule } from 'src/app/shared/components/common-header/common-header.module';

const routes = [
  {
    path: '',
    component: HouseholdListComponent
  }
];

@NgModule({
  declarations: [
    HouseholdListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonHeaderModule,
    RouterModule.forChild(routes)
  ]
})
export class HouseholdListModule { }
