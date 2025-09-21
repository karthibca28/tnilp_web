import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


//Logout
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

// Language
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { CartModel } from './topbar.model';
import { AuthService } from 'src/app/shared/service/auth.service';
import { TranslationService } from 'src/app/shared/service/translation.service';
import { LanguageService } from 'src/app/shared/service/language.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  // cartData!: CartModel[];
  total = 0;
  cart_length: any = 0;
  loginData: any;
  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  currentLanguage: string = 'en';
  loginType: string = '';
  selectedDepartmentKey: string = '';
  departments: Record<string, string> = {
    tanfinet: "TANFINET Dashboard",
    tactv: "TACTV Dashboard",
    ict: "ICT  Dashboard",
    tva: "TVA Dashboard",
    itnt: "iTNT Dashboard",
    tnega: "TNeGA Dashboard",
    deg: "DeG Dashboard",
    elcot: "ELCOT Dashboard"
  }

  constructor(@Inject(DOCUMENT) private document: any,
    public _cookiesService: CookieService, public translate: TranslateService,
    private router: Router, private authService: AuthService, private translationService: TranslationService, private languageService: LanguageService) { }

  ngOnInit(): void {
    this.loginData = JSON.parse(sessionStorage.getItem('userInfo') as any);
    console.log('login', this.loginData);
    const currentUrl = this.router.url;
    const matchedKey = Object.keys(this.departments).find((key) => currentUrl.toLowerCase().includes(key));
    if (matchedKey) {
      this.selectedDepartmentKey = this.departments[matchedKey] || '';
    }
    this.element = document.documentElement;

    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get('lang');

    //  Fetch Data
    // this.cartData = cartData;
    // this.cart_length = this.cartData.length;
    // this.cartData.forEach((item) => {
    //   var item_price = item.quantity * item.price
    //   this.total += item_price
    // });

    this.loginData = JSON.parse(sessionStorage.getItem('userInfo') as any);
    this.loginType = this.loginData?.loginType || '';
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open')
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  /**
  * Topbar Light-Dark Mode Change
  */
  changeMode(mode: string) {
    this.mode = mode;
    // this.eventService.broadcast('changeMode', mode);

    // switch (mode) {
    //   case 'light':
    //     document.documentElement.setAttribute('data-bs-theme', "light");
    //     break;
    //   case 'dark':
    //     document.documentElement.setAttribute('data-bs-theme', "dark");
    //     break;
    //   default:
    //     document.documentElement.setAttribute('data-bs-theme', "light");
    //     break;
    // }
  }

  /***
   * Language Listing
   */
  listLang = [];

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    // this.languageService.setLanguage(lang);
    this.translate.use(lang);
    this.languageService.setLanguage(lang);
  }

  /**
   * Logout the user
   */
  logout() {
    this.authService.logOut().subscribe((res: any) => {
      if (res) {
        this.router.navigate(['/login/tactv']);
        sessionStorage.removeItem('userInfo');
      } else {

      }

    })
  }

  windowScroll() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "block";
      document.getElementById('page-topbar')?.classList.add('topbar-shadow')
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "none";
      document.getElementById('page-topbar')?.classList.remove('topbar-shadow')
    }
  }

  // Delete Item
  deleteItem(event: any, id: any) {
    var price = event.target.closest('.dropdown-item').querySelector('.item_price').innerHTML;
    var Total_price = this.total - price;
    this.total = Total_price;
    this.cart_length = this.cart_length - 1;
    this.total > 1 ? (document.getElementById("empty-cart") as HTMLElement).style.display = "none" : (document.getElementById("empty-cart") as HTMLElement).style.display = "block";
    document.getElementById('item_' + id)?.remove();
  }

  // Search Topbar
  Search() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var input: any, filter: any, ul: any, li: any, a: any | undefined, i: any, txtValue: any;
    input = document.getElementById("search-options") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    var inputLength = filter.length;

    if (inputLength > 0) {
      dropdown.classList.add("show");
      searchOptions.classList.remove("d-none");
      var inputVal = input.value.toUpperCase();
      var notifyItem = document.getElementsByClassName("notify-item");

      Array.from(notifyItem).forEach(function (element: any) {
        var notifiTxt = ''
        if (element.querySelector("h6")) {
          var spantext = element.getElementsByTagName("span")[0].innerText.toLowerCase()
          var name = element.querySelector("h6").innerText.toLowerCase()
          if (name.includes(inputVal)) {
            notifiTxt = name
          } else {
            notifiTxt = spantext
          }
        } else if (element.getElementsByTagName("span")) {
          notifiTxt = element.getElementsByTagName("span")[0].innerText.toLowerCase()
        }
        if (notifiTxt)
          element.style.display = notifiTxt.includes(inputVal) ? "block" : "none";

      });
    } else {
      dropdown.classList.remove("show");
      searchOptions.classList.add("d-none");
    }
  }

  /**
   * Search Close Btn
   */
  closeBtn() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var searchInputReponsive = document.getElementById("search-options") as HTMLInputElement;
    dropdown.classList.remove("show");
    searchOptions.classList.add("d-none");
    searchInputReponsive.value = "";
  }
  toggleLanguage(): void {
    const newLanguage = this.currentLanguage === 'en' ? 'ta' : 'en';
    localStorage.setItem('selectedLanguage', newLanguage);
    this.languageService.setLanguage(newLanguage);
    this.currentLanguage = newLanguage;
  }
  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }
  goToMinisterHome(): void {
    this.router.navigate(['/main/it-minister/landing-page']);
  }
  departmentTitles: { [key: string]: string } = {
    tanfinet: 'dashboard.tanfinet',
    tactv: 'dashboard.tactv',
    ictacademy: 'dashboard.ictacademy',
    tva: 'dashboard.tva',
    itnt: 'dashboard.itnt',
    tnega: 'dashboard.tnega',
    deg: 'dashboard.deg',
    elcot: 'dashboard.elcot'
  };
  getInitials(firstName: string, lastName: string): string {
    if (!firstName && !lastName) return '';
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  }

}
