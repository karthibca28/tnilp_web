import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonHeaderComponent } from './common-header.component';

@NgModule({
  declarations: [
    CommonHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    CommonHeaderComponent
  ]
})
export class CommonHeaderModule { }
