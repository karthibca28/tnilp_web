import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-500',
  templateUrl: './page-500.component.html',
  styleUrl: './page-500.component.scss'
})
export class Page500Component implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // goBack() {
  //   const lastUrl = sessionStorage.getItem('lastUrlBeforeError') || '/login';
  //   sessionStorage.removeItem('lastUrlBeforeError');
  //   this.router.navigateByUrl(lastUrl);
  // }

  goBack(): void {
    if (window.history.length > 2) {
      window.history.go(-2);
    } else {
      this.router.navigate(['/']);
    }
  }


}
