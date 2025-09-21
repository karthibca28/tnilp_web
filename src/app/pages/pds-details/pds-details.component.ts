import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MisReportService } from 'src/app/shared/service/mis-report.service';

@Component({
  selector: 'app-pds-details',
  templateUrl: './pds-details.component.html',
  styleUrls: ['./pds-details.component.scss']
})
export class PdsDetailsComponent implements OnInit {
  pdsId: string = '';
  pdsNumber: string = '';
  headName: string = '';
  pdsData: any = null;
  markDetails: any[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private misReportService: MisReportService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pdsId = params['id'] || '';
      this.pdsNumber = params['pdsNumber'] || '';
      this.headName = params['headName'] || '';
      
      if (this.pdsId) {
        this.loadPdsDetails();
      } else {
        this.error = 'No PDS ID provided';
      }
    });
  }

  loadPdsDetails(): void {
    this.loading = true;
    this.error = '';
    
    this.misReportService.getInduvutalMarkList(parseInt(this.pdsId)).subscribe({
      next: (res) => {
        console.log('PDS Details Response:', res);
        
        if (res && res.status && res.data) {
          this.pdsData = res.data;
          // Extract mark details if available (API uses 'markDetail' singular)
          if (res.data.markDetail && Array.isArray(res.data.markDetail)) {
            this.markDetails = res.data.markDetail;
          }
        } else {
          this.error = 'No data found for this PDS number';
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading PDS details:', err);
        this.error = 'Failed to load PDS details. Please try again.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/mis-report']);
  }

  getIndicatorValue(data: any, indicator: string): any {
    return data && data[indicator] !== undefined ? data[indicator] : 'N/A';
  }

  getTotalScore(data: any): number {
    if (!data) return 0;
    
    const indicators = [
      'houseTotal', 'toiletTotal', 'socialTotal', 'incomeSourceTotal',
      'healthTotal', 'assetLivelihoodsTotal', 'foodSecurityTotal',
      'dueClimateTotal', 'aspirationTotal'
    ];
    
    return indicators.reduce((total, indicator) => {
      const value = data[indicator];
      return total + (typeof value === 'number' ? value : 0);
    }, 0);
  }

  getIndicatorsData(): any[] {
    return [
      { field: 'houseTotal', label: 'House', max: 5, icon: 'fas fa-home' },
      { field: 'toiletTotal', label: 'Toilet', max: 5, icon: 'fas fa-toilet' },
      { field: 'socialTotal', label: 'Social', max: 5, icon: 'fas fa-users' },
      { field: 'incomeSourceTotal', label: 'Income Source', max: 5, icon: 'fas fa-dollar-sign' },
      { field: 'healthTotal', label: 'Health', max: 5, icon: 'fas fa-heartbeat' },
      { field: 'assetLivelihoodsTotal', label: 'Asset Based Livelihoods', max: 5, icon: 'fas fa-industry' },
      { field: 'foodSecurityTotal', label: 'Food Security', max: 5, icon: 'fas fa-utensils' },
      { field: 'dueClimateTotal', label: 'Affected due to Climate', max: 5, icon: 'fas fa-cloud-rain' },
      { field: 'aspirationTotal', label: 'Aspiration', max: 5, icon: 'fas fa-star' }
    ];
  }

  getSurveyDate(): string {
    // Return current date or extract from data if available
    return new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getMarkDetails(): any[] {
    return this.markDetails || [];
  }

  getCategoryIcon(categoryKey: string): string {
    const iconMap: { [key: string]: string } = {
      'house': 'fas fa-home',
      'toilet': 'fas fa-toilet',
      'caste': 'fas fa-users',
      'social': 'fas fa-users',
      'incomeSource': 'fas fa-dollar-sign',
      'health': 'fas fa-heartbeat',
      'assetLivelihoods': 'fas fa-industry',
      'foodSecurity': 'fas fa-utensils',
      'dueClimate': 'fas fa-cloud-rain',
      'aspiration': 'fas fa-star'
    };
    return iconMap[categoryKey] || 'fas fa-question-circle';
  }

  getCategoryTotal(category: any): number {
    if (!category || !category.list) return 0;
    return category.list.reduce((total: number, item: any) => {
      const mark = parseInt(item.mark) || 0;
      return total + mark;
    }, 0);
  }

  formatAnswer(answer: any): string {
    if (answer === null || answer === undefined || answer === '') {
      return 'Not specified';
    }
    return String(answer);
  }

  getMarkColor(mark: any): string {
    const markValue = parseInt(mark) || 0;
    if (markValue === 0) return 'text-danger';
    if (markValue <= 2) return 'text-warning';
    if (markValue <= 4) return 'text-info';
    return 'text-success';
  }
}