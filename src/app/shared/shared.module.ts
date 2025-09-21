import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbAccordionModule, NgbDropdownModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';

// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';

// Counter
import { CountUpModule } from 'ngx-countup';
import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PrimeModule } from './modules/prime/prime.module';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { MaterialModule } from './modules/material/material.module';
import { SkeletonLoaderComponent } from './component/skeleton-loader/skeleton-loader.component';
import { Page500Component } from './component/page-500/page-500.component';
import { Page404Component } from './component/page-404/page-404.component';

@NgModule({
  declarations: [
    SkeletonLoaderComponent,
    Page500Component,
    Page404Component
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    SlickCarouselModule,
    CountUpModule,
    TableModule,
    FormsModule,
    DropdownModule,
    PrimeModule,
    MaterialModule,
    ReactiveFormsModule,
    NgbPagination
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    SkeletonLoaderComponent,
    Page500Component,
    Page404Component
  ],
  providers: []
})
export class SharedModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}