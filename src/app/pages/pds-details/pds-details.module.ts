import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PdsDetailsRoutingModule } from './pds-details-routing.module';
import { PdsDetailsComponent } from './pds-details.component';
import { CommonHeaderModule } from 'src/app/shared/components/common-header/common-header.module';

@NgModule({
  declarations: [
    PdsDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PdsDetailsRoutingModule,
    CommonHeaderModule
  ]
})
export class PdsDetailsModule { }