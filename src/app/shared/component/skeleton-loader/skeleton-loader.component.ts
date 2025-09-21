import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent implements OnInit {

  @Input() type: 'card' | 'text' | 'circle' | 'horizontal' | 'vertical' | 'chart' = 'card';

  ngOnInit(): void {

  }

}
