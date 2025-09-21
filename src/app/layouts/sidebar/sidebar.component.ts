import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { MenuTypes } from 'src/app/pages/common/models/sidebar/sidebar-type';
import { TranslationService } from 'src/app/shared/service/translation.service';
import { AuthService } from 'src/app/shared/service/auth.service';
import { LanguageService } from 'src/app/shared/service/language.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() loginType!: string;
  menu: any;
  toggle: any = true;
  menuItems: MenuItem[] = [];
  appData: any;
  currentLanguage: 'en' | 'ta' = 'en';  // default language
  sidebarModules = {
    it_minister: 'it-minister',
    tanfinet: 'tanfinet',
    tnega: 'tnega',
    tactv: 'tactv',
    tva: 'tva',
    elcot: 'elcot',
    ict: 'ict',
    itnt: 'itnt',
    deg: 'deg'
  }
  // @ViewChild('sideMenu') sideMenu!: ElementRef;
  // @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(private router: Router, private translationService: TranslationService, private authService: AuthService, private languageService: LanguageService) {
    // translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    for (const [key, value] of Object.entries(this.sidebarModules)) {
      if (this.router.url.includes(value)) {
        this.menuItems = MenuTypes.appConfig[key].menus; // ✅ fix
        this.appData = MenuTypes.appConfig[key];         // ✅ if you also want logo + label
        break;
      }
    }
    const savedLang = localStorage.getItem('selectedLanguage') as 'en' | 'ta';
    if (savedLang) {
      this.currentLanguage = savedLang;
      this.languageService.setLanguage(savedLang); // or your LanguageService if you have
    }
  }
  handleAction(action: string) {
    if (action === 'logout') {
      this.logout();
    } else if (action === 'toggleLanguage') {
      this.toggleLanguage();
    }
  }

  toggleLanguage(): void {
    const newLanguage = this.currentLanguage === 'en' ? 'ta' : 'en';
    localStorage.setItem('selectedLanguage', newLanguage);
    this.languageService.setLanguage(newLanguage); // or LanguageService if you use
    this.currentLanguage = newLanguage;
  }
  logout(): void {
    this.authService.logOut().subscribe({
      next: (res: any) => {
        if (res) {
          sessionStorage.removeItem('userInfo');
          this.router.navigate(['/login/tactv']);
        }
      },
      error: (err) => {
        console.error('Logout failed', err);
      }
    });
  }

  // this.menuItems = [
  //   {
  //     id: 1,
  //     label: 'Overview',
  //     icon: 'mdi mdi-monitor-dashboard',
  //     link: '/main/page/tanfinet/overview/dashboard',
  //   },
  //   {
  //     id: 2,
  //     label: 'Insights',
  //     icon: 'mdi mdi-file-chart-outline',
  //     link: '/main/page/tanfinet/firm/first-firm',
  //     // subItems: [
  //     //   {
  //     //     label: 'staffOnboarding',
  //     //     link: '/main/page/onboarding/onboarding-list',
  //     //     permission: ["Onboarding:onboardingStaff"],
  //     //   },
  //     // ]
  //   },
  //   {
  //     id: 1,
  //     label: 'Financial Plan',
  //     icon: 'mdi mdi-currency-inr',
  //     link: '/main/page/tanfinet/financial-plan/dashboard',
  //   },
  //   {
  //     id: 1,
  //     label: 'Projects',
  //     icon: 'mdi mdi-signal-cellular-outline',
  //     link: '/main/page/tanfinet/projects/dashboard',
  //   },
  // ]
  // this.router.events.subscribe((event) => {
  //   if (document.documentElement.getAttribute('data-layout') != "twocolumn") {
  //     if (event instanceof NavigationEnd) {
  //       this.initActiveMenu();
  //     }
  //   }
  // });


  /***
   * Activate droup down set
   */
  ngAfterViewInit() {
    setTimeout(() => {
      this.initActiveMenu();
    }, 0);
  }


  removeActivation(items: any) {
    items.forEach((item: any) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        (item.nextElementSibling) ? item.nextElementSibling.classList.remove("show") : null;
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });
  }

  toggleSubItem(event: any) {
    let isCurrentMenuId = event.target.closest('a.nav-link');
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    if (isMenu.classList.contains("show")) {
      isMenu.classList.remove("show");
      isCurrentMenuId.setAttribute("aria-expanded", "false");
    } else {
      let dropDowns = Array.from(document.querySelectorAll('.sub-menu'));
      dropDowns.forEach((node: any) => {
        node.classList.remove('show');
      });

      let subDropDowns = Array.from(document.querySelectorAll('.menu-dropdown .nav-link'));
      subDropDowns.forEach((submenu: any) => {
        submenu.setAttribute('aria-expanded', "false");
      });

      if (event.target && event.target.nextElementSibling) {
        isCurrentMenuId.setAttribute("aria-expanded", "true");
        event.target.nextElementSibling.classList.toggle("show");
      }
    }
  };

  toggleExtraSubItem(event: any) {
    let isCurrentMenuId = event.target.closest('a.nav-link');
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    if (isMenu.classList.contains("show")) {
      isMenu.classList.remove("show");
      isCurrentMenuId.setAttribute("aria-expanded", "false");
    } else {
      let dropDowns = Array.from(document.querySelectorAll('.extra-sub-menu'));
      dropDowns.forEach((node: any) => {
        node.classList.remove('show');
      });

      let subDropDowns = Array.from(document.querySelectorAll('.menu-dropdown .nav-link'));
      subDropDowns.forEach((submenu: any) => {
        submenu.setAttribute('aria-expanded', "false");
      });

      if (event.target && event.target.nextElementSibling) {
        isCurrentMenuId.setAttribute("aria-expanded", "true");
        event.target.nextElementSibling.classList.toggle("show");
      }
    }
  };

  // Click wise Parent active class add
  toggleParentItem(event: any) {
    let isCurrentMenuId = event.target.closest('a.nav-link');
    let dropDowns = Array.from(document.querySelectorAll('#navbar-nav .show'));
    dropDowns.forEach((node: any) => {
      node.classList.remove('show');
    });
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const iconItems = Array.from(ul.getElementsByTagName("a"));
      let activeIconItems = iconItems.filter((x: any) => x.classList.contains("active"));
      activeIconItems.forEach((item: any) => {
        item.setAttribute('aria-expanded', "false")
        item.classList.remove("active");
      });
    }
    isCurrentMenuId.setAttribute("aria-expanded", "true");
    if (isCurrentMenuId) {
      this.activateParentDropdown(isCurrentMenuId);
    }
  }

  toggleItem(event: any) {
    let isCurrentMenuId = event.target.closest('a.nav-link');
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    if (isMenu.classList.contains("show")) {
      isMenu.classList.remove("show");
      isCurrentMenuId.setAttribute("aria-expanded", "false");
    } else {
      let dropDowns = Array.from(document.querySelectorAll('#navbar-nav .show'));
      dropDowns.forEach((node: any) => {
        node.classList.remove('show');
      });
      (isMenu) ? isMenu.classList.add('show') : null;
      const ul = document.getElementById("navbar-nav");
      if (ul) {
        const iconItems = Array.from(ul.getElementsByTagName("a"));
        let activeIconItems = iconItems.filter((x: any) => x.classList.contains("active"));
        activeIconItems.forEach((item: any) => {
          item.setAttribute('aria-expanded', "false")
          item.classList.remove("active");
        });
      }
      isCurrentMenuId.setAttribute("aria-expanded", "true");
      if (isCurrentMenuId) {
        this.activateParentDropdown(isCurrentMenuId);
      }
    }
  }

  // remove active items of two-column-menu
  activateParentDropdown(item: any) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

    if (parentCollapseDiv) {
      // to set aria expand true remaining
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse")) {
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").classList.add("show");
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").previousElementSibling.classList.add("active");
        }
      }
      return false;
    }
    return false;
  }

  updateActive(event: any) {
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(event.target);
  }

  initActiveMenu() {
    const pathName = window.location.pathname;
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) => x.classList.contains("active"));
      this.removeActivation(activeItems);

      let matchingMenuItem = items.find((x: any) => {
        return x.pathname === pathName;
      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    var sidebarsize = document.documentElement.getAttribute("data-sidebar-size");
    if (sidebarsize == 'sm-hover-active') {
      document.documentElement.setAttribute("data-sidebar-size", 'sm-hover')
    } else {
      document.documentElement.setAttribute("data-sidebar-size", 'sm-hover-active')
    }
  }
  isChildActive(item: MenuItem): boolean {
    if (item.link && this.router.isActive(item.link, true)) {
      return true;
    }
    if (item.subItems) {
      return item.subItems.some((sub: MenuItem) => this.isChildActive(sub));
    }
    return false;
  } 
  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    document.body.classList.remove('vertical-sidebar-enable');
  }
  // getTranslation(key: string): string {
  //   return this.translationService.getTranslation(key);
  // }
  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }



}
