import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MasterDataService, District, Block } from 'src/app/shared/service/master-data.service';

export interface TableColumn {
  field: string;
  header: string;
}

export interface SurveyData {
  sno: number;
  id: string;
  pdsNumber: string;
  headName: string;
  districtName: string;
  blockName: string;
  taluk: string;
  village: string;
  houseTotal: number;
  toiletTotal: number;
  casteTotal: string;
  socialTotal: number;
  incomeSourceTotal: number;
  healthTotal: number;
  assetLivelihoodsTotal: number;
  foodSecurityTotal: number;
  dueClimateTotal: number;
  aspirationTotal: number;
  allTotal: number;
  [key: string]: any; // Allow dynamic property access
}

export interface SurveyResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    cols: TableColumn[];
    values: SurveyData[];
  };
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
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
  tableData: SurveyData[] = [];
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  // Utility
  Math = Math;

  constructor(
    private router: Router,
    private http: HttpClient,
    private masterDataService: MasterDataService
  ) { }

  ngOnInit(): void {
    console.log('ReportsComponent initialized');
    this.loadMasterData();
    this.loadSurveyData();
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

  loadSurveyData(): void {
    const params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('limit', this.pageSize.toString())
      .set('district_id', this.filters.districtId || '')
      .set('blockId', this.filters.blockId || '')
      .set('fromDate', this.filters.fromDate || '')
      .set('toDate', this.filters.toDate || '');

    this.http.get<SurveyResponse>(`${environment.apiUrl}Adminrural/getRuralCompletedSurveyMarkList`, { params })
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.tableColumns = response.data.cols;
            this.tableData = response.data.values;
            // Note: API doesn't return total count, so we'll estimate based on current data
            this.totalRecords = response.data.values.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          }
        },
        error: (error) => {
          console.error('Error loading survey data:', error);
          // Fallback to mock data
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
      });
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
    this.loadSurveyData();
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
    this.loadSurveyData();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadSurveyData();
    }
  }

  onExportData(): void {
    console.log('Export data functionality');
    // Implement export functionality here
  }

  onSurveyReport(): void {
    console.log('Survey Report clicked');
  }

  onMisreport(): void {
    console.log('Misreport clicked');
  }

  onLogout(): void {
    console.log('Logout functionality');
    // Implement logout functionality here
  }
}
