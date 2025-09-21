/**
 * Mis Report Component
 * 
 * IMPORTANT: This component uses MisReportService for all API calls.
 * DO NOT add direct HTTP calls or HttpClient imports.
 * All API operations should go through the service.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterDataService, District, Block } from 'src/app/shared/service/master-data.service';
import { MisReportService, MisReportData, MisReportResponse, MisReportFilters, TableColumn } from 'src/app/shared/service/mis-report.service';


@Component({
  selector: 'app-mis-report',
  templateUrl: './mis-report.component.html',
  styleUrls: ['./mis-report.component.scss']
})
export class MisReportComponent implements OnInit {
  // Filter state
  showFilters = false;
  filters = {
    districtId: '',
    blockId: '',
    fromDate: '',
    toDate: ''
  };
  // Master data
  districts: District[] = [];
  blocks: Block[] = [];
  // Table data
  tableColumns: TableColumn[] = [];
  tableData: MisReportData[] = [];
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  loading = false;
  blockId: string = '';
  districtId: string = '';
  fromDate: string = '';
  toDate: string = '';
  userLevel: string = '';
  users: any[] = [];
  // Utility
  Math = Math;
  filteredUsers: any[] = [];

  constructor(
    private router: Router,
    private masterDataService: MasterDataService,
    private misReportService: MisReportService  // Service handles all API calls
  ) { 
    // DO NOT inject HttpClient here - use MisReportService instead
  }

  ngOnInit(): void {
    console.log('MisReportComponent initialized');
    this.loadMasterData();
    this.fetchMarks();
  }

  loadMasterData(): void {
    // Load districts
    this.masterDataService.getDistricts().subscribe({
      next: (response) => {
        this.districts = response.data;
      },
      error: (error) => {
        console.error('Error loading districts:', error);
        // Fallback to mock data
        this.districts = [
          { id: '1', districtCode: 'ARI', name: 'ARIYALUR' },
          { id: '2', districtCode: 'CGL', name: 'CHENGALPATTU' },
          { id: '3', districtCode: 'COL', name: 'COIMBATORE' },
          { id: '4', districtCode: 'TNM', name: 'THIRUVANNAMALAI' },
          { id: '5', districtCode: 'VPM', name: 'VILLUPURAM' }
        ];
      }
    });
  }

  fetchMarks() {
    this.loading = true;
    this.misReportService.getMarkList(this.filters.districtId, this.filters.blockId, this.filters.fromDate, this.filters.toDate, this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          console.log('Fetched survey data:', res);
          
          // Handle the standard API response structure
          if (res && res.status && res.data) {
            // Filter out Sno and Id columns
            this.tableColumns = (res.data.cols || []).filter((col: any) => 
              col.field !== 'sno' && col.field !== 'id'
            );
            this.tableData = res.data.values || [];
            
            // Use pagination metadata from API response
            this.totalRecords = res.totalRec || 0;
            this.pageSize = res.perPage || this.pageSize;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          } else {
            // Fallback for unexpected response structure
            this.tableData = [];
            this.totalRecords = 0;
            this.totalPages = 0;
          }
          
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching survey data:', err);
          this.tableData = [];
          this.totalRecords = 0;
          this.totalPages = 0;
          this.loading = false;
        }
      });
  }

  resetFilters() {
    this.filters.districtId = '';
    this.filters.blockId = '';
    this.filters.fromDate = '';
    this.filters.toDate = '';
    this.blocks = [];
    this.currentPage = 1;
    this.fetchMarks();
  }

  loadMisReportData(): void {
    console.log('Loading mis report data via service...');
    
    const filters: MisReportFilters = {
      page: this.currentPage,
      limit: this.pageSize,
      districtId: this.filters.districtId || undefined,
      blockId: this.filters.blockId || undefined,
      fromDate: this.filters.fromDate || undefined,
      toDate: this.filters.toDate || undefined
    };

    // Use service for API call - DO NOT CHANGE TO DIRECT HTTP CALLS
    this.misReportService.getMisReportData(filters)
      .subscribe({
        next: (response) => {
          console.log('Mis report data loaded successfully via service');
          if (response.status) {
            this.tableColumns = response.data.cols;
            this.tableData = response.data.values;
            this.totalRecords = response.data.values.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          }
        },
        error: (error) => {
          console.error('Error loading misreport data via service:', error);
          // Fallback to mock data
          this.loadMockData();
        }
      });
  }

  private loadMockData(): void {
    this.tableColumns = [
      { field: 'sno', header: 'Sno' },
      { field: 'id', header: 'ID' },
      { field: 'pdsNumber', header: 'PDS Number' },
      { field: 'headName', header: 'Head Name' },
      { field: 'districtName', header: 'District Name' },
      { field: 'blockName', header: 'Block Name' },
      { field: 'taluk', header: 'Taluk' },
      { field: 'village', header: 'Village' },
      { field: 'houseTotal', header: 'House' },
      { field: 'toiletTotal', header: 'Toilet' },
      { field: 'casteTotal', header: 'Caste' },
      { field: 'socialTotal', header: 'Social' },
      { field: 'incomeSourceTotal', header: 'Income Source' },
      { field: 'healthTotal', header: 'Health' },
      { field: 'assetLivelihoodsTotal', header: 'Asset Based Livelihoods' },
      { field: 'foodSecurityTotal', header: 'Food Security' },
      { field: 'dueClimateTotal', header: 'Affected due to Climate' },
      { field: 'aspirationTotal', header: 'Aspiration' },
      { field: 'allTotal', header: 'Total' }
    ];
    this.tableData = [
      {
        sno: 1,
        id: '1',
        pdsNumber: '333000002791',
        headName: 'Vishwa',
        districtName: 'ARIYALUR',
        blockName: 'ANDIMADAM',
        taluk: 'Veppanthattai (Tk)',
        village: 'Malaiyalapatti',
        houseTotal: 0,
        toiletTotal: 0,
        casteTotal: '1',
        socialTotal: 0,
        incomeSourceTotal: 4,
        healthTotal: 0,
        assetLivelihoodsTotal: 0,
        foodSecurityTotal: 0,
        dueClimateTotal: 0,
        aspirationTotal: 0,
        allTotal: 5
      },
      {
        sno: 2,
        id: '3',
        pdsNumber: '333000005958',
        headName: 'Ramkumari Tamilmaran',
        districtName: 'ARIYALUR',
        blockName: 'ANDIMADAM',
        taluk: 'Thanjavur (Tk)',
        village: 'Manojipatti',
        houseTotal: 0,
        toiletTotal: 0,
        casteTotal: '5',
        socialTotal: 0,
        incomeSourceTotal: 0,
        healthTotal: 0,
        assetLivelihoodsTotal: 0,
        foodSecurityTotal: 0,
        dueClimateTotal: 0,
        aspirationTotal: 0,
        allTotal: 5
      }
    ];
    this.totalRecords = this.tableData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onDistrictChange(): void {
    if (this.filters.districtId) {
      this.masterDataService.getBlocks(this.filters.districtId).subscribe({
        next: (response) => {
          this.blocks = response.data;
          this.filters.blockId = ''; // Reset block selection
        },
        error: (error) => {
          console.error('Error loading blocks:', error);
          this.blocks = [];
        }
      });
    } else {
      this.blocks = [];
      this.filters.blockId = '';
    }
  }

  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when applying filters
    this.fetchMarks();
  }

  clearFilters(): void {
    this.filters = {
      districtId: '',
      blockId: '',
      fromDate: '',
      toDate: ''
    };
    this.blocks = [];
    this.currentPage = 1;
    this.fetchMarks();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchMarks();
    }
  }

  onExportData(): void {
    const filters: MisReportFilters = {
      districtId: this.filters.districtId || undefined,
      blockId: this.filters.blockId || undefined,
      fromDate: this.filters.fromDate || undefined,
      toDate: this.filters.toDate || undefined
    };

    this.misReportService.exportMisReportData(filters, 'excel').subscribe({
      next: (blob) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mis-report-${new Date().toISOString().split('T')[0]}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error exporting data:', error);
        // Fallback: show alert or notification
        alert('Export failed. Please try again.');
      }
    });
  }

  onRowClick(row: any): void {
    if (row.id) {
      // Navigate to PDS details component with the ID
      this.router.navigate(['/pds-details'], { 
        queryParams: { id: row.id, pdsNumber: row.pdsNumber, headName: row.headName }
      });
    }
  }

}
