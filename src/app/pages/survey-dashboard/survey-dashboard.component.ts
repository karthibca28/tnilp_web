import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { MockUser } from 'src/app/shared/helpers/mock-jwt.helper';
import { PatIndicatorService } from 'src/app/shared/service/pat-indicator.service';
import Swal from 'sweetalert2';
import { MasterDataService } from 'src/app/shared/service/master-data.service';
import { MisReportService } from 'src/app/shared/service/mis-report.service';

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

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'completed';
  households: number;
  avgScore: number;
  highVulnerability: number;
  createdAt: string;
  updatedAt: string;
}

export interface VulnerabilityData {
  district: string;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}

export interface VulnerabilityIndicator {
  id: number;
  name: string;
  description: string;
  minScore: number;
  maxScore: number;
  category: string;
}

export interface Activity {
  id: string;
  type: 'survey' | 'response' | 'user';
  text: string;
  time: string;
}

export interface OverallSummary {
  totalHouseholdEntries: number;
  todayHouseholdEntries: number;
  completedEntries: number;
  pendingEntries: number;
}

export interface HouseholdType {
  uidSmartCard: number;
  withoutUidSmartCard: number;
  pdsNotFound: number;
  personNotAvailable: number;
  homeless: number;
}

@Component({
  selector: 'app-survey-dashboard',
  templateUrl: './survey-dashboard.component.html',
  styleUrls: ['./survey-dashboard.component.scss']
})
export class SurveyDashboardComponent implements OnInit {
  districts: District[] = [];
  vulnerabilityIndicators: VulnerabilityIndicator[] = [];
  recentActivity: Activity[] = [];
  currentUser: MockUser | null = null;
  
  // PAT Indicator stats
  patIndicatorStats: { totalCount: number; averageScore: number; highVulnerability: number } = {
    totalCount: 0,
    averageScore: 0,
    highVulnerability: 0
  };

  // User Management stats
  userManagementStats: { totalUsers: number; activeUsers: number; newUsers: number } = {
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0
  };

  // Overall Summary data
  overallSummary: OverallSummary = {
    totalHouseholdEntries: 2270006,
    todayHouseholdEntries: 1,
    completedEntries: 2259917,
    pendingEntries: 10089
  };

  // Household Type data
  householdType: HouseholdType = {
    uidSmartCard: 2084422,
    withoutUidSmartCard: 1409,
    pdsNotFound: 46138,
    personNotAvailable: 129357,
    homeless: 307
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private misService: MisReportService,
    private patIndicatorService: PatIndicatorService
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

    this.initializeDistricts();
    this.initializeVulnerabilityIndicators();
    this.initializeActivity();
    this.loadPatIndicatorStats();
    this.loadUserManagementStats();
  }

  getDashboardAdmin(): void {
    this.misService.getDashboardAdmin().subscribe({
      next: (response: any) => {
        console.log('Dashboard Admin API Response:', response);
        
        // Handle the API response structure
        if (response && response.status && response.data) {
          // Extract data from the response
          const dashboardData = response.data;
          console.log('Dashboard Data:', dashboardData);
          
          // Update Overall Summary with real API data
          this.updateOverallSummary(dashboardData);
          
          // Update Household Type with real API data
          this.updateHouseholdType(dashboardData);
          
          // Update PAT indicator stats based on the actual API response structure
          this.patIndicatorStats = {
            totalCount: dashboardData.totalEntry || 0,
            averageScore: dashboardData.completedEntry || 0,
            highVulnerability: dashboardData.pendingEntry || 0
          };
          
          console.log('Updated Overall Summary:', this.overallSummary);
          console.log('Updated Household Type:', this.householdType);
          console.log('Updated PAT Indicator Stats:', this.patIndicatorStats);
        } else {
          console.warn('Invalid API response structure:', response);
        }
      },
      error: (error: any) => {
        console.error('Error loading dashboard admin data:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
      }
    });
  }

  private updateOverallSummary(data: any): void {
    this.overallSummary = {
      totalHouseholdEntries: data.totalEntry || 0,
      todayHouseholdEntries: data.todayEntry || 0,
      completedEntries: data.completedEntry || 0,
      pendingEntries: data.pendingEntry || 0
    };
  }

  private updateHouseholdType(data: any): void {
    this.householdType = {
      uidSmartCard: data.pdsCount || 0,
      withoutUidSmartCard: data.withoutpdsCount || 0,
      pdsNotFound: data.pdsNotFound || 0,
      personNotAvailable: data.notAvilableCount || 0,
      homeless: data.houseLessCount || 0
    };
  }

  private initializeDistricts(): void {
    this.districts = [
      {
        id: '1',
        name: 'Thiruvannamalai',
        tamilName: 'திருவண்ணாமலை',
        image: 'assets/images/districts/thiruvannamalai.svg',
        status: 'active',
        totalUsers: 45,
        blocks: 8,
        completionRate: 78,
        blocksList: ['Thiruvannamalai', 'Chengam', 'Polur', 'Arani', 'Cheyyar', 'Vandavasi', 'Gingee', 'Tirukkoilur']
      },
      {
        id: '2',
        name: 'Villupuram',
        tamilName: 'விழுப்புரம்',
        image: 'assets/images/districts/villupuram.svg',
        status: 'active',
        totalUsers: 52,
        blocks: 10,
        completionRate: 85,
        blocksList: ['Villupuram', 'Tindivanam', 'Vanur', 'Gingee', 'T.V. Nallur', 'Kandachipuram', 'Marakkanam', 'Melmalayanur', 'Olakkoor', 'Puducherry']
      }
    ];
  }

  onDistrictClick(district: District): void {
    // Navigate to survey users page with district data
    this.router.navigate(['/survey-users'], { 
      state: { district: district } 
    });
  }

  onViewDistrict(district: District): void {
    this.onDistrictClick(district);
  }

  onManageDistrict(district: District): void {
    this.onDistrictClick(district);
  }

  private loadPatIndicatorStats(): void {
    // Call the dashboard admin API instead of PAT indicator service
    this.getDashboardAdmin();
  }

  onPatIndicatorClick(): void {
    this.router.navigate(['/pat-indicator']);
  }

  // Household Type Card Click Methods
  onUidSmartCardClick(): void {
    this.router.navigate(['/household-list'], { 
      queryParams: { type: 'uid-smart-card', api: 'getpdsDataList' } 
    });
  }

  onWithoutUidSmartCardClick(): void {
    this.router.navigate(['/household-list'], { 
      queryParams: { type: 'without-uid-smart-card', api: 'getWithoutpdsDataList' } 
    });
  }

  onPdsNotFoundClick(): void {
    this.router.navigate(['/household-list'], { 
      queryParams: { type: 'pds-not-found', api: 'getpdsNotAvailableDataList' } 
    });
  }

  onPersonNotAvailableClick(): void {
    this.router.navigate(['/household-list'], { 
      queryParams: { type: 'person-not-available', api: 'getPersonNotAvailableList' } 
    });
  }

  onHomelessClick(): void {
    this.router.navigate(['/household-list'], { 
      queryParams: { type: 'homeless', api: 'getHomeLessDetailsList' } 
    });
  }

  private loadUserManagementStats(): void {
    // Mock user management stats
    this.userManagementStats = {
      totalUsers: 25,
      activeUsers: 22,
      newUsers: 5
    };
  }

  onUserManagementClick(): void {
    this.router.navigate(['/user-master']);
  }

  private initializeVulnerabilityIndicators(): void {
    this.vulnerabilityIndicators = [
      {
        id: 1,
        name: 'Shelter/Home',
        description: 'Housing Type - From homeless (5) to own pakka house (0)',
        minScore: 0,
        maxScore: 5,
        category: 'Basic Needs'
      },
      {
        id: 2,
        name: 'Special Category (Caste)',
        description: 'Community - PVTG (5) to Others (1)',
        minScore: 1,
        maxScore: 5,
        category: 'Social Status'
      },
      {
        id: 3,
        name: 'Special Category (Social)',
        description: 'Social Category - Destitute/Widow (5) to Others (0)',
        minScore: 0,
        maxScore: 5,
        category: 'Social Status'
      },
      {
        id: 4,
        name: 'Income Source',
        description: 'Monthly Income - No income (5) to >₹10,000 (0)',
        minScore: 0,
        maxScore: 5,
        category: 'Economic'
      },
      {
        id: 5,
        name: 'Health',
        description: 'Health Status - Chronic illness (5) to no illness (0)',
        minScore: 0,
        maxScore: 5,
        category: 'Health'
      },
      {
        id: 6,
        name: 'Productive Assets',
        description: 'Assets Owned - No assets (5) to large assets (0)',
        minScore: 0,
        maxScore: 5,
        category: 'Economic'
      },
      {
        id: 7,
        name: 'Food Security',
        description: 'Food Source - Only PDS (5) to PDS + Other (3)',
        minScore: 3,
        maxScore: 5,
        category: 'Basic Needs'
      },
      {
        id: 8,
        name: 'Affected by Climate',
        description: 'Climate Impact - 3+ times (5) to not affected (0)',
        minScore: 0,
        maxScore: 5,
        category: 'Environmental'
      },
      {
        id: 9,
        name: 'Sanitation',
        description: 'Toilet Available - No (5) to Yes (0)',
        minScore: 0,
        maxScore: 5,
        category: 'Basic Needs'
      },
      {
        id: 10,
        name: 'Livelihood Aspirations',
        description: 'Aspirations Status - Clear (5) to no aspiration (0)',
        minScore: 0,
        maxScore: 5,
        category: 'Social'
      }
    ];
  }

  private initializeActivity(): void {
    this.recentActivity = [
      {
        id: '1',
        type: 'response',
        text: 'New household survey completed in Chennai District - Score: 32',
        time: '2 minutes ago'
      },
      {
        id: '2',
        type: 'survey',
        text: 'Salem District Phase 1 survey launched',
        time: '1 hour ago'
      },
      {
        id: '3',
        type: 'user',
        text: 'New surveyor registered for Coimbatore District',
        time: '3 hours ago'
      },
      {
        id: '4',
        type: 'response',
        text: 'High vulnerability household identified in Madurai - Score: 45',
        time: '5 hours ago'
      },
      {
        id: '5',
        type: 'survey',
        text: 'Tiruchirapalli District survey data synchronized',
        time: '1 day ago'
      }
    ];
  }

  onSurveyClick(survey: Survey): void {
    console.log('Survey clicked:', survey);
    // Navigate to survey details
  }

  onViewSurvey(survey: Survey): void {
    console.log('View survey:', survey);
    // Navigate to survey results
    this.router.navigate(['/survey-results']);
  }

  onEditSurvey(survey: Survey): void {
    console.log('Edit survey:', survey);
    // Navigate to survey editor
  }

  onViewAllActivity(): void {
    console.log('View all activity');
    // Navigate to activity page
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
    return this.currentUser.fullName;
  }
}
