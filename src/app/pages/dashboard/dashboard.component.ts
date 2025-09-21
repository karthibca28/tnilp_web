import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { MockUser } from 'src/app/shared/helpers/mock-jwt.helper';
import Swal from 'sweetalert2';

export interface ModuleCard {
  id: string;
  title: string;
  icon: string;
  description: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: MockUser | null = null;
  modules: ModuleCard[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check authentication
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Get current user
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Redirect to survey dashboard
    this.router.navigate(['/survey-dashboard']);
  }

  private initializeModules(): void {
    this.modules = [
      {
        id: 'contract-management',
        title: 'Contract Management',
        icon: 'contract',
        description: 'Manage contracts and agreements',
        route: '/main/page/contract-management',
        color: '#4A90E2'
      },
      {
        id: 'hr-payroll',
        title: 'HR & Payroll',
        icon: 'hr',
        description: 'Human resources and payroll management',
        route: '/main/page/hr-payroll',
        color: '#7ED321'
      },
      {
        id: 'finance',
        title: 'Finance',
        icon: 'finance',
        description: 'Financial management and reporting',
        route: '/main/page/finance',
        color: '#F5A623'
      }
    ];

    // Filter modules based on user permissions
    this.modules = this.modules.filter(module => {
      return this.hasModuleAccess(module.id);
    });
  }

  private hasModuleAccess(moduleId: string): boolean {
    if (!this.currentUser) return false;

    // Define module permissions
    const modulePermissions: { [key: string]: string[] } = {
      'contract-management': ['contracts.view', 'contracts.manage'],
      'hr-payroll': ['hr.view', 'payroll.view'],
      'finance': ['finance.view', 'reports.generate']
    };

    const requiredPermissions = modulePermissions[moduleId] || [];
    
    // Check if user has any of the required permissions
    return requiredPermissions.some(permission => 
      this.currentUser?.permissions.includes(permission)
    );
  }

  onModuleClick(module: ModuleCard): void {
    if (module.id === 'contract-management') {
      // Navigate to contract management
      this.router.navigate(['/contract-management']);
    } else {
      // For other modules, show a message since they don't exist yet
      Swal.fire({
        icon: 'info',
        title: `${module.title}`,
        text: `${module.description} - Module coming soon!`,
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  onLogout(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of the system',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logOut().subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Logged Out',
              text: 'You have been successfully logged out',
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/login']);
            });
          },
          error: (error) => {
            console.error('Logout error:', error);
            // Still navigate to login even if logout fails
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }

  getUserDisplayName(): string {
    if (!this.currentUser) return 'User';
    
    const roleMap: { [key: string]: string } = {
      'super_admin': 'SUPER ADMIN',
      'admin': 'ADMIN',
      'user': 'USER'
    };

    return roleMap[this.currentUser.role] || 'USER';
  }
}
