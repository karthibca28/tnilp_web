import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MisReportService } from 'src/app/shared/service/mis-report.service';

@Component({
  selector: 'app-household-list',
  templateUrl: './household-list.component.html',
  styleUrls: ['./household-list.component.scss']
})
export class HouseholdListComponent implements OnInit {
  householdType: string = '';
  apiMethod: string = '';
  householdData: any[] = [];
  columns: any[] = [];
  loading = false;
  error = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  
  // Card titles mapping
  cardTitles: { [key: string]: string } = {
    'uid-smart-card': 'Households with UID & Smart Card',
    'without-uid-smart-card': 'Households without UID & Smart Card',
    'pds-not-found': 'PDS Not Found',
    'person-not-available': 'Person Not Available',
    'homeless': 'Homeless Households'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private misReportService: MisReportService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.householdType = params['type'] || '';
      this.apiMethod = params['api'] || '';
      
      if (this.householdType && this.apiMethod) {
        this.loadHouseholdData();
      } else {
        this.error = 'Invalid parameters provided';
      }
    });
  }

  loadHouseholdData(): void {
    this.loading = true;
    this.error = '';
    
    console.log(`Loading data for ${this.householdType} using API: ${this.apiMethod}`);
    
    // Call the appropriate API method based on the apiMethod parameter
    let apiCall;
    switch (this.apiMethod) {
      case 'getpdsDataList':
        apiCall = this.misReportService.getpdsDataList();
        break;
      case 'getWithoutpdsDataList':
        apiCall = this.misReportService.getWithoutpdsDataList();
        break;
      case 'getpdsNotAvailableDataList':
        apiCall = this.misReportService.getpdsNotAvailableDataList();
        break;
      case 'getPersonNotAvailableList':
        apiCall = this.misReportService.getPersonNotAvailableList();
        break;
      case 'getHomeLessDetailsList':
        apiCall = this.misReportService.getHomeLessDetailsList();
        break;
      default:
        this.error = 'Invalid API method specified';
        this.loading = false;
        return;
    }

    apiCall.subscribe({
      next: (response: any) => {
        console.log(`${this.apiMethod} API Response:`, response);
        
        if (response && response.status && response.data) {
          // Handle the correct API response structure
          if (response.data.cols && Array.isArray(response.data.cols)) {
            this.columns = response.data.cols;
          } else {
            this.columns = [];
          }
          
          if (response.data.values && Array.isArray(response.data.values)) {
            this.householdData = response.data.values;
          } else {
            this.householdData = [];
          }
          
          // Set pagination info
          this.totalRecords = response.totalRec || response.data.values?.length || 0;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          
          // Clear any previous errors
          this.error = '';
        } else {
          this.error = 'No data found';
          this.householdData = [];
          this.columns = [];
          this.totalRecords = 0;
          this.totalPages = 0;
        }
        
        this.loading = false;
      },
      error: (error: any) => {
        console.error(`Error loading ${this.apiMethod} data:`, error);
        this.error = `Failed to load ${this.cardTitles[this.householdType]} data. Please try again.`;
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/survey-dashboard']);
  }

  getCardTitle(): string {
    return this.cardTitles[this.householdType] || 'Household Data';
  }

  getTotalCount(): number {
    return this.totalRecords;
  }

  // Pagination methods
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadHouseholdData();
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const size = parseInt(target.value);
    this.pageSize = size;
    this.currentPage = 1;
    this.loadHouseholdData();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalRecords);
    return `${start}-${end} of ${this.totalRecords}`;
  }

  // Dynamic table methods
  getColumnWidth(field: string): string {
    const widthMap: { [key: string]: string } = {
      'sno': '5%',
      'pdsNumber': '12%',
      'headName': '15%',
      'address': '25%',
      'mobileNo': '10%',
      'aadhaarNumber': '12%',
      'districtName': '10%',
      'blockName': '10%',
      'createdAt': '12%',
      'createdByName': '10%'
    };
    return widthMap[field] || 'auto';
  }

  getCellClass(field: string): string {
    if (field === 'sno') {
      return 'fw-medium text-center';
    }
    if (field === 'mobileNo' || field === 'aadhaarNumber') {
      return 'font-monospace';
    }
    if (field === 'createdAt') {
      return 'text-muted small';
    }
    return '';
  }

  getCellValue(item: any, field: string): string {
    const value = item[field];
    
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    
    // Format specific fields
    if (field === 'createdAt' && value) {
      return new Date(value).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    if (field === 'mobileNo' && value) {
      return value.toString();
    }
    
    if (field === 'aadhaarNumber' && value) {
      return value.toString();
    }
    
    return value.toString();
  }
}