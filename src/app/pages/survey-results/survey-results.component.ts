import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { MockUser } from 'src/app/shared/helpers/mock-jwt.helper';
import Swal from 'sweetalert2';

export interface ResponseOption {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TrendPoint {
  value: number;
  date: string;
}

export interface DemographicData {
  category: string;
  percentage: number;
  count: number;
}

export interface Comment {
  id: string;
  rating: number;
  text: string;
  date: string;
  category: string;
}

@Component({
  selector: 'app-survey-results',
  templateUrl: './survey-results.component.html',
  styleUrls: ['./survey-results.component.scss']
})
export class SurveyResultsComponent implements OnInit {
  responseOptions: ResponseOption[] = [];
  trendData: TrendPoint[] = [];
  trendLabels: string[] = [];
  demographicData: DemographicData[] = [];
  recentComments: Comment[] = [];
  currentUser: MockUser | null = null;

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

    this.initializeResponseOptions();
    this.initializeTrendData();
    this.initializeDemographicData();
    this.initializeComments();
  }

  private initializeResponseOptions(): void {
    this.responseOptions = [
      {
        label: 'Very satisfied',
        count: 450,
        percentage: 36,
        color: '#00a651'
      },
      {
        label: 'Somewhat satisfied',
        count: 350,
        percentage: 28,
        color: '#17a2b8'
      },
      {
        label: 'Neither satisfied nor dissatisfied',
        count: 200,
        percentage: 16,
        color: '#ffc107'
      },
      {
        label: 'Somewhat dissatisfied',
        count: 150,
        percentage: 12,
        color: '#fd7e14'
      },
      {
        label: 'Very dissatisfied',
        count: 100,
        percentage: 8,
        color: '#dc3545'
      }
    ];
  }

  private initializeTrendData(): void {
    this.trendData = [
      { value: 45, date: 'Week 1' },
      { value: 52, date: 'Week 2' },
      { value: 48, date: 'Week 3' },
      { value: 55, date: 'Week 4' },
      { value: 60, date: 'Week 5' },
      { value: 58, date: 'Week 6' },
      { value: 65, date: 'Week 7' },
      { value: 62, date: 'Week 8' }
    ];

    this.trendLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
  }

  private initializeDemographicData(): void {
    this.demographicData = [
      { category: '18-25 years', percentage: 25, count: 312 },
      { category: '26-35 years', percentage: 35, count: 437 },
      { category: '36-45 years', percentage: 22, count: 275 },
      { category: '46-55 years', percentage: 12, count: 150 },
      { category: '55+ years', percentage: 6, count: 76 }
    ];
  }

  private initializeComments(): void {
    this.recentComments = [
      {
        id: '1',
        rating: 5,
        text: 'Excellent service! The staff was very helpful and the process was smooth.',
        date: '2 days ago',
        category: 'Service Quality'
      },
      {
        id: '2',
        rating: 4,
        text: 'Good overall experience, but the waiting time could be improved.',
        date: '3 days ago',
        category: 'Efficiency'
      },
      {
        id: '3',
        rating: 3,
        text: 'Average service. Nothing exceptional but nothing terrible either.',
        date: '4 days ago',
        category: 'General'
      },
      {
        id: '4',
        rating: 5,
        text: 'Outstanding support! The digital services are very user-friendly.',
        date: '5 days ago',
        category: 'Digital Services'
      },
      {
        id: '5',
        rating: 2,
        text: 'The process was confusing and took longer than expected.',
        date: '6 days ago',
        category: 'Process'
      }
    ];
  }

  onBackToDashboard(): void {
    this.router.navigate(['/survey-dashboard']);
  }

  onExportResults(): void {
    Swal.fire({
      title: 'Export Results',
      text: 'Choose export format',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'PDF',
      cancelButtonText: 'Excel',
      showDenyButton: true,
      denyButtonText: 'CSV'
    }).then((result) => {
      if (result.isConfirmed) {
        this.exportToPDF();
      } else if (result.isDenied) {
        this.exportToCSV();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.exportToExcel();
      }
    });
  }

  private exportToPDF(): void {
    // Implement PDF export
    Swal.fire('Success', 'PDF export started', 'success');
  }

  private exportToExcel(): void {
    // Implement Excel export
    Swal.fire('Success', 'Excel export started', 'success');
  }

  private exportToCSV(): void {
    // Implement CSV export
    Swal.fire('Success', 'CSV export started', 'success');
  }

  onViewTrendDetails(): void {
    Swal.fire('Trend Details', 'Detailed trend analysis will be shown here', 'info');
  }

  onViewDemographicDetails(): void {
    Swal.fire('Demographic Details', 'Detailed demographic breakdown will be shown here', 'info');
  }

  onViewAllComments(): void {
    Swal.fire('All Comments', 'Complete comments list will be shown here', 'info');
  }
}
