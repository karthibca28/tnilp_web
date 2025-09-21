import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/shared/service/toast.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  selected: boolean;
  showActions: boolean;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: false
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.initializeUsers();
    this.filteredUsers = [...this.users];
    this.calculateTotalPages();
  }

  private initializeUsers(): void {
    this.users = [
      {
        id: 'USR001',
        name: 'John Smith',
        email: 'john.smith@mtc.com',
        role: 'Admin',
        status: 'Active',
        department: 'IT Department',
        selected: false,
        showActions: false
      },
      {
        id: 'USR002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@mtc.com',
        role: 'Manager',
        status: 'Active',
        department: 'HR Department',
        selected: false,
        showActions: false
      },
      {
        id: 'USR003',
        name: 'Mike Wilson',
        email: 'mike.wilson@mtc.com',
        role: 'User',
        status: 'Inactive',
        department: 'Finance Department',
        selected: false,
        showActions: false
      },
      {
        id: 'USR004',
        name: 'Emily Davis',
        email: 'emily.davis@mtc.com',
        role: 'Super Admin',
        status: 'Active',
        department: 'Operations',
        selected: false,
        showActions: false
      },
      {
        id: 'USR005',
        name: 'David Brown',
        email: 'david.brown@mtc.com',
        role: 'User',
        status: 'Pending',
        department: 'Marketing',
        selected: false,
        showActions: false
      },
      {
        id: 'USR006',
        name: 'Lisa Anderson',
        email: 'lisa.anderson@mtc.com',
        role: 'Manager',
        status: 'Active',
        department: 'Customer Service',
        selected: false,
        showActions: false
      },
      {
        id: 'USR007',
        name: 'Robert Taylor',
        email: 'robert.taylor@mtc.com',
        role: 'User',
        status: 'Active',
        department: 'Sales',
        selected: false,
        showActions: false
      },
      {
        id: 'USR008',
        name: 'Jennifer Martinez',
        email: 'jennifer.martinez@mtc.com',
        role: 'Admin',
        status: 'Inactive',
        department: 'Legal',
        selected: false,
        showActions: false
      }
    ];
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  onFilter(): void {
    this.toastService.showInfo('Filter', 'Filter functionality will be available soon.', 2000);
  }

  onSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.filteredUsers.forEach(user => {
      user.selected = isChecked;
    });
  }

  onUserSelect(user: User): void {
    // Individual user selection logic
  }

  isAllSelected(): boolean {
    return this.filteredUsers.length > 0 && this.filteredUsers.every(user => user.selected);
  }

  toggleActions(user: User): void {
    // Close all other action menus
    this.users.forEach(u => {
      if (u.id !== user.id) {
        u.showActions = false;
      }
    });
    user.showActions = !user.showActions;
  }

  onEditUser(user: User): void {
    user.showActions = false;
    this.toastService.showInfo('Edit User', `Editing user: ${user.name}`, 2000);
  }

  onViewDetails(user: User): void {
    user.showActions = false;
    this.toastService.showInfo('View Details', `Viewing details for: ${user.name}`, 2000);
  }

  onRemoveUser(user: User): void {
    user.showActions = false;
    this.toastService.showError('Remove User', `Are you sure you want to remove ${user.name}?`, 3000);
  }

  onAddUser(): void {
    this.toastService.showInfo('Add User', 'Add user functionality will be available soon.', 2000);
  }

  onExport(): void {
    this.toastService.showInfo('Export', 'Export functionality will be available soon.', 2000);
  }

  getUserInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getRoleTagClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'super admin': return 'primary';
      case 'admin': return 'info';
      case 'manager': return 'warning';
      case 'user': return 'success';
      default: return 'primary';
    }
  }

  getStatusTagClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'primary';
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  getDisplayRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
    return `${start}-${end}`;
  }
}