import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MasterDataService, District, Block, Panchayat, Designation, UserLevel, RoleType } from 'src/app/shared/service/master-data.service';
import { UserService } from 'src/app/shared/service/user.service';
import Swal from 'sweetalert2';

export interface User {
  id: string;
  sno?: number;
  name: string;
  email: string;
  mobile: string;
  district: string;
  block: string;
  panchayat: string;
  userLevel: string;
  target?: string;
  lastLogin?: string;
  designation?: string;
  role?: string;
  isActive: number; // 1 for active, 0 for inactive
  createdAt?: string;
}

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss']
})
export class UserMasterComponent implements OnInit {
  showAddForm = false;
  currentView: 'list' | 'create' = 'list'; // Track current view mode
  users: User[] = [];
  districts: District[] = [];
  blocks: Block[] = [];
  panchayats: Panchayat[] = [];
  userLevels: UserLevel[] = [];
  designations: Designation[] = [];
  roleTypes: RoleType[] = [];
  // Statistics
  totalUsers = 0;
  activeUsers = 0;
  districtsCount = 0;
  // Form
  userForm: FormGroup;
  loading = false;
  userLevel: string = '';
  districtId: string = '';
  fromDate: string = '';
  toDate: string = '';
  
  // Modern table properties
  filteredUsers: User[] = [];
  searchTerm: string = '';
  sortBy: string = 'newest';
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 1;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private masterDataService: MasterDataService
  ) {
    this.userForm = this.fb.group({
      district: ['', Validators.required],
      name: ['', Validators.required],
      password: ['tnilp@123', Validators.required],
      userLevel: ['', Validators.required],
      block: ['', Validators.required],
      email: [''],
      designation: ['', Validators.required],
      panchayat: ['', Validators.required],
      mobile: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check query parameters to determine view mode
    this.route.queryParams.subscribe(params => {
      if (params['view'] === 'create') {
        this.currentView = 'create';
        this.showAddForm = true;
      } else {
        this.currentView = 'list';
        this.showAddForm = false;
      }
    });

    this.loadMasterData();
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading = true;
    this.userService.getUserList(this.userLevel, this.districtId, this.fromDate, this.toDate)
      .subscribe({
        next: (res) => {
          console.log('Fetched users:', res);
          // Handle the API response structure properly
          if (res && res.data && res.data.values) {
            this.users = res.data.values;
          } else if (Array.isArray(res)) {
            this.users = res;
          } else {
            this.users = [];
          }
          this.filteredUsers = [...this.users];
          this.calculateStats();
          this.updatePagination();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          this.users = []; // Set empty array on error
          this.loading = false;
        }
      });
  }

  resetFilters() {
    this.userLevel = '';
    this.districtId = '';
    this.fromDate = '';
    this.toDate = '';
    this.fetchUsers();
  }

  loadUsers(): void {
    // Mock user data
    this.users = [
      {
        id: '1',
        name: 'Ravi Kumar',
        email: 'ravi.kumar@example.com',
        mobile: '9876543210',
        district: 'THIRUVANNAMALAI',
        block: 'Thiruvannamalai',
        panchayat: 'Arunachalam',
        userLevel: 'Primary',
        designation: 'CO',
        role: 'Rural',
        isActive: 1,
        createdAt: '2025-01-15'
      },
      {
        id: '2',
        name: 'Lakshmi Devi',
        email: 'lakshmi.devi@example.com',
        mobile: '9876543211',
        district: 'THIRUVANNAMALAI',
        block: 'Chengam',
        panchayat: 'Chengam',
        userLevel: 'Secondary',
        designation: 'SHG member',
        role: 'Rural',
        isActive: 1,
        createdAt: '2025-01-14'
      },
      {
        id: '3',
        name: 'Muthu Kumar',
        email: 'muthu.kumar@example.com',
        mobile: '9876543212',
        district: 'VILLUPURAM',
        block: 'Villupuram',
        panchayat: 'Villupuram',
        userLevel: 'Primary',
        designation: 'CRP',
        role: 'Rural',
        isActive: 0,
        createdAt: '2025-01-13'
      }
    ];

    this.calculateStats();
  }

  calculateStats(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(user => user.isActive === 1).length;
    this.districtsCount = new Set(this.users.map(user => user.district)).size;
  }

  loadMasterData(): void {
    // Load districts
    this.masterDataService.getDistricts().subscribe({
      next: (response) => {
        console.log('Districts loaded:', response);
        this.districts = response.data;
      },
      error: (error) => {
        console.error('Error loading districts:', error);
        this.districts = [];
      }
    });

    // Load designations
    this.masterDataService.getDesignations().subscribe({
      next: (response) => {
        this.designations = response.data;
      },
      error: (error) => {
        console.error('Error loading designations:', error);
        this.designations = [];
      }
    });

    // Load user levels
    this.masterDataService.getUserLevels().subscribe({
      next: (response) => {
        this.userLevels = response.data;
      },
      error: (error) => {
        console.error('Error loading user levels:', error);
        this.userLevels = [];
      }
    });

    // Load role types
    this.masterDataService.getRoleTypes().subscribe({
      next: (response) => {
        this.roleTypes = response.data;
      },
      error: (error) => {
        console.error('Error loading role types:', error);
        this.roleTypes = [];
      }
    });
  }

  onDistrictChange(): void {
    const districtId = this.userForm.get('district')?.value;
    if (districtId) {
      this.userForm.get('block')?.setValue('');
      this.userForm.get('panchayat')?.setValue('');
      this.blocks = [];
      this.panchayats = [];

      this.masterDataService.getBlocks(districtId).subscribe({
        next: (response) => {
          this.blocks = response.data;
        },
        error: (error) => {
          console.error('Error loading blocks:', error);
          this.blocks = [];
        }
      });
    } else {
      this.blocks = [];
      this.panchayats = [];
    }
  }

  onBlockChange(): void {
    const blockId = this.userForm.get('block')?.value;
    if (blockId) {
      this.userForm.get('panchayat')?.setValue('');
      this.panchayats = [];

      this.masterDataService.getPanchayats(blockId).subscribe({
        next: (response) => {
          this.panchayats = response.data;
        },
        error: (error) => {
          console.error('Error loading panchayats:', error);
          this.panchayats = [];
        }
      });
    } else {
      this.panchayats = [];
    }
  }

  onAddUser(): void {
    this.showAddForm = true;
    this.userForm.reset();
    this.userForm.patchValue({
      password: 'tnilp@123'
    });
  }

  onCancelAdd(): void {
    this.showAddForm = false;
    this.userForm.reset();
    this.blocks = [];
    this.panchayats = [];
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      
      // Get selected values for display
      const selectedDistrict = this.districts.find(d => d.id === formData.district);
      const selectedBlock = this.blocks.find(b => b.blockId === formData.block);
      const selectedPanchayat = this.panchayats.find(p => p.panchayatId === formData.panchayat);
      const selectedDesignation = this.designations.find(d => d.designationId === formData.designation);
      const selectedRole = this.roleTypes.find(r => r.id.toString() === formData.role);

      const newUser: User = {
        id: (this.users.length + 1).toString(),
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        district: selectedDistrict?.name || '',
        block: selectedBlock?.blockName || '',
        panchayat: selectedPanchayat?.panchayatName || '',
        userLevel: formData.userLevel,
        designation: selectedDesignation?.name || '',
        role: selectedRole?.name || '',
        isActive: 1, // 1 for active
        createdAt: new Date().toISOString().split('T')[0]
      };

      this.users.unshift(newUser);
      this.calculateStats();
      this.onCancelAdd();

      Swal.fire({
        icon: 'success',
        title: 'User Added Successfully',
        text: `${newUser.name} has been added to the system.`,
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields.',
        confirmButtonText: 'OK'
      });
    }
  }

  onEditUser(user: User): void {
    Swal.fire({
      title: 'Edit User',
      text: `Edit functionality for ${user.name} will be implemented here.`,
      icon: 'info',
      showConfirmButton: true,
      confirmButtonText: 'OK'
    });
  }

  onDeleteUser(user: User): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.users = this.users.filter(u => u.id !== user.id);
        this.calculateStats();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `${user.name} has been deleted.`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  onRefreshUsers(): void {
    this.fetchUsers();
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

  // View switching methods
  switchToListView(): void {
    this.currentView = 'list';
    this.showAddForm = false;
    this.router.navigate(['/user-master'], { queryParams: {} });
  }

  switchToCreateView(): void {
    this.currentView = 'create';
    this.showAddForm = true;
    this.router.navigate(['/user-master'], { queryParams: { view: 'create' } });
  }

  // Modern table methods
  onSearch(): void {
    this.filterUsers();
  }

  onSortChange(): void {
    this.sortUsers();
  }

  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user => 
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.mobile?.toLowerCase().includes(searchLower) ||
        user.district?.toLowerCase().includes(searchLower) ||
        user.block?.toLowerCase().includes(searchLower)
      );
    }
    this.currentPage = 1; // Reset to first page when filtering
    this.updatePagination();
  }

  sortUsers(): void {
    switch (this.sortBy) {
      case 'newest':
        this.filteredUsers.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'oldest':
        this.filteredUsers.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case 'name':
        this.filteredUsers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'district':
        this.filteredUsers.sort((a, b) => (a.district || '').localeCompare(b.district || ''));
        break;
      case 'status':
        this.filteredUsers.sort((a, b) => b.isActive - a.isActive);
        break;
    }
    this.currentPage = 1; // Reset to first page when sorting
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Get paginated users for current page
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  // Helper methods for pagination display
  getStartIndex(): number {
    if (this.filteredUsers.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndIndex(): number {
    const endIndex = this.currentPage * this.pageSize;
    return Math.min(endIndex, this.filteredUsers.length);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to maxVisiblePages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (this.currentPage <= 3) {
        // Show first 4 pages + last page
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
      } else if (this.currentPage >= this.totalPages - 2) {
        // Show first page + last 4 pages
        pages.push(1);
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page + current page range + last page
        pages.push(1);
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  }
}