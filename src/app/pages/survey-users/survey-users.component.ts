import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, UserData, UserListResponse } from 'src/app/shared/service/user.service';
import Swal from 'sweetalert2';

export interface District {
  id: string;
  name: string;
  tamilName: string;
  image: string;
  status: 'active' | 'draft' | 'completed';
  totalUsers: number;
  blocks: number;
  completionRate: number;
  blocksList: string[];
}

@Component({
  selector: 'app-survey-users',
  templateUrl: './survey-users.component.html',
  styleUrls: ['./survey-users.component.scss']
})
export class SurveyUsersComponent implements OnInit {
  users: UserData[] = [];
  selectedDistrict: District | null = null;
  selectedUserLevel: string = '';
  selectedBlock: string = '';
  availableBlocks: string[] = [];
  totalUsers: number = 0;
  activeUsers: number = 0;
  totalTarget: number = 0;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Get district data from route params or state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.selectedDistrict = navigation.extras.state['district'];
    }
    
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    
    this.userService.getMockUserList().subscribe({
      next: (response: UserListResponse) => {
        let allUsers = response.data.values;
        
        // Filter users based on selected district
        if (this.selectedDistrict) {
          allUsers = allUsers.filter(user => 
            user.district.toUpperCase() === this.selectedDistrict!.name.toUpperCase()
          );
        }
        
        // Filter users based on selected block
        if (this.selectedBlock) {
          allUsers = allUsers.filter(user => 
            user.block === this.selectedBlock
          );
        }
        
        // Filter users based on user level
        if (this.selectedUserLevel) {
          allUsers = allUsers.filter(user => 
            user.userLevel === this.selectedUserLevel
          );
        }
        
        this.users = allUsers;
        this.calculateUserStats();
        this.updateAvailableBlocks();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load user data. Please try again.'
        });
      }
    });
  }

  calculateUserStats(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(user => user.isActive === '1').length;
    this.totalTarget = this.users.reduce((sum, user) => sum + parseInt(user.target || '0'), 0);
  }

  updateAvailableBlocks(): void {
    if (this.selectedDistrict) {
      this.availableBlocks = [...new Set(this.users.map(user => user.block))].sort();
    }
  }

  onFilterChange(): void {
    this.loadUsers();
  }

  onRefreshData(): void {
    this.loadUsers();
    Swal.fire({
      icon: 'success',
      title: 'Data Refreshed',
      text: 'User data has been refreshed successfully.',
      timer: 1500,
      showConfirmButton: false
    });
  }

  onBackToDashboard(): void {
    this.router.navigate(['/survey-dashboard']);
  }

  onViewUser(user: UserData): void {
    console.log('View user:', user);
    // Navigate to user details page or show modal
    Swal.fire({
      title: 'User Details',
      html: `
        <div style="text-align: left;">
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Mobile:</strong> ${user.mobile}</p>
          <p><strong>Email:</strong> ${user.email || 'Not provided'}</p>
          <p><strong>District:</strong> ${user.district}</p>
          <p><strong>Block:</strong> ${user.block}</p>
          <p><strong>Panchayat:</strong> ${user.panchayat}</p>
          <p><strong>User Level:</strong> ${user.userLevel}</p>
          <p><strong>Target:</strong> ${user.target}</p>
          <p><strong>Last Login:</strong> ${user.lastLogin || 'Never'}</p>
          <p><strong>Status:</strong> ${user.isActive === '1' ? 'Active' : 'Inactive'}</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: 'Close'
    });
  }

  onEditUser(user: UserData): void {
    console.log('Edit user:', user);
    // Navigate to edit user page or show edit modal
    Swal.fire({
      title: 'Edit User',
      text: `Edit functionality for ${user.name} will be implemented here.`,
      icon: 'info',
      showConfirmButton: true,
      confirmButtonText: 'OK'
    });
  }

  onViewUserSurveys(user: UserData): void {
    console.log('View user surveys:', user);
    // Navigate to user's survey results
    this.router.navigate(['/survey-results'], { 
      queryParams: { userId: user.userId, userName: user.name }
    });
  }

  onLogout(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of the system.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }
}