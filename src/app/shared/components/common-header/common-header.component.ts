import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { MockUser } from 'src/app/shared/helpers/mock-jwt.helper';

export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  active: boolean;
  children?: NavigationItem[];
}

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss']
})
export class CommonHeaderComponent implements OnInit {
  currentUser: MockUser | null = null;
  showUserDropdown = false;
  searchQuery = '';

  // Navigation menu items
  navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      route: '/survey-dashboard',
      icon: 'home',
      active: true
    },
    {
      id: 'survey-team',
      label: 'User Management',
      route: '/user-master',
      icon: 'users',
      active: false
    },
    {
      id: 'pat-indicator',
      label: 'PAT Indicator',
      route: '/pat-indicator',
      icon: 'bar-chart',
      active: false
    },
    // {
    //   id: 'survey-details',
    //   label: 'Survey Details',
    //   route: '/survey-users',
    //   icon: 'clipboard-list',
    //   active: false
    // },
    // {
    //   id: 'reports',
    //   label: 'Reports',
    //   route: '/reports',
    //   icon: 'file-text',
    //   active: false
    // },
    {
      id: 'mis-report',
      label: 'Reports',
      route: '/mis-report',
      icon: 'file-text',
      active: false
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Navigation items:', this.navigationItems);
    this.updateActiveNavigation();
  }

  /**
   * Update active navigation based on current route
   */
  updateActiveNavigation(): void {
    const currentRoute = this.router.url;
    
    this.navigationItems.forEach(item => {
      // Check if current route matches the item route (ignoring query parameters)
      const itemRoute = item.route.split('?')[0];
      const currentRouteBase = currentRoute.split('?')[0];
      item.active = itemRoute === currentRouteBase;
      
      if (item.children) {
        item.children.forEach(child => {
          // Check if current route matches the child route (ignoring query parameters)
          const childRoute = child.route.split('?')[0];
          child.active = childRoute === currentRouteBase;
        });
      }
    });
  }

  /**
   * Handle navigation item click
   */
  onNavItemClick(item: NavigationItem, event?: Event): void {
    // If item has children, prevent default and don't navigate - just show dropdown on hover
    if (item.children) {
      console.log('Navigation item with children clicked:', item.label);
      if (event) {
        event.preventDefault();
      }
      return;
    }
    
    // If no children, navigate normally
    this.onNavigationClick(item);
  }

  /**
   * Navigate to a route and update active state
   */
  onNavigationClick(item: NavigationItem): void {
    console.log('=== NAVIGATION DEBUG ===');
    console.log('Navigation clicked:', item);
    console.log('Current user:', this.currentUser);
    console.log('Is authenticated:', this.authService.isAuthenticated());
    console.log('Token exists:', !!localStorage.getItem('token'));
    console.log('User exists:', !!localStorage.getItem('user'));
    console.log('Current route:', this.router.url);
    console.log('Target route:', item.route);
    console.log('========================');
    
    this.router.navigate([item.route]).then((success) => {
      console.log('Navigation result:', success);
      console.log('New route after navigation:', this.router.url);
      this.updateActiveNavigation();
    }).catch((error) => {
      console.error('Navigation error:', error);
    });
  }

  /**
   * Toggle user dropdown
   */
  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  /**
   * Close user dropdown when clicking outside
   */
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-profile-dropdown')) {
      this.showUserDropdown = false;
    }
  }

  /**
   * Handle search
   */
  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Implement search functionality
      console.log('Search query:', this.searchQuery);
    }
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchQuery = '';
  }

  /**
   * Logout user
   */
  onLogout(): void {
    this.authService.logOut().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Get user initials for avatar
   */
  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    
    const name = this.currentUser.fullName || this.currentUser.username;
    const parts = name.split(' ');
    
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    
    return name.substring(0, 2).toUpperCase();
  }

  /**
   * Get user role display name
   */
  getUserRoleDisplay(): string {
    if (!this.currentUser) return 'User';
    
    const role = this.currentUser.role;
    const roleMap: { [key: string]: string } = {
      'RuralAdmin': 'Rural Admin',
      'Surveyor': 'Surveyor',
      'Supervisor': 'Supervisor',
      'super_admin': 'Super Admin'
    };
    
    return roleMap[role] || role;
  }
}
