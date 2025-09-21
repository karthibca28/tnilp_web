import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatIndicatorService, PatIndicatorData, DistrictSummary, BlockSummary, PanchayatSummary } from 'src/app/shared/service/pat-indicator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pat-indicator',
  templateUrl: './pat-indicator.component.html',
  styleUrls: ['./pat-indicator.component.scss']
})
export class PatIndicatorComponent implements OnInit {
  // Current navigation state
  currentLevel: 'district' | 'block' | 'panchayat' | 'users' = 'district';
  selectedDistrict: string = '';
  selectedBlock: string = '';
  selectedPanchayat: string = '';

  // Data for different levels
  districtSummary: DistrictSummary[] = [];
  blockSummary: BlockSummary[] = [];
  panchayatSummary: PanchayatSummary[] = [];
  filteredUsers: PatIndicatorData[] = [];

  // Overall statistics
  totalUsers: number = 0;
  averageScore: number = 0;
  highVulnerability: number = 0;

  constructor(
    private patIndicatorService: PatIndicatorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDistrictSummary();
  }

  loadDistrictSummary(): void {
    this.patIndicatorService.getDistrictSummary().subscribe({
      next: (districts) => {
        this.districtSummary = districts;
        this.calculateOverallStats();
      },
      error: (error) => {
        console.error('Error loading district summary:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load district data. Please try again.'
        });
      }
    });
  }

  calculateOverallStats(): void {
    this.totalUsers = this.districtSummary.reduce((sum, district) => sum + district.totalUsers, 0);
    const totalScore = this.districtSummary.reduce((sum, district) => sum + (district.averageScore * district.totalUsers), 0);
    this.averageScore = Math.round((totalScore / this.totalUsers) * 10) / 10;
    this.highVulnerability = this.districtSummary.reduce((sum, district) => sum + district.highVulnerability, 0);
  }

  onDistrictClick(district: DistrictSummary): void {
    this.selectedDistrict = district.district;
    this.currentLevel = 'block';
    this.loadBlockSummary();
  }

  loadBlockSummary(): void {
    this.patIndicatorService.getBlockSummary(this.selectedDistrict).subscribe({
      next: (blocks) => {
        this.blockSummary = blocks;
      },
      error: (error) => {
        console.error('Error loading block summary:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load block data. Please try again.'
        });
      }
    });
  }

  onBlockClick(block: BlockSummary): void {
    this.selectedBlock = block.block;
    this.currentLevel = 'panchayat';
    this.loadPanchayatSummary();
  }

  loadPanchayatSummary(): void {
    this.patIndicatorService.getPanchayatSummary(this.selectedDistrict, this.selectedBlock).subscribe({
      next: (panchayats) => {
        this.panchayatSummary = panchayats;
      },
      error: (error) => {
        console.error('Error loading panchayat summary:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load panchayat data. Please try again.'
        });
      }
    });
  }

  onPanchayatClick(panchayat: PanchayatSummary): void {
    this.selectedPanchayat = panchayat.panchayat;
    this.currentLevel = 'users';
    this.loadUsers();
  }

  loadUsers(): void {
    this.patIndicatorService.getPatIndicatorList(this.selectedDistrict, this.selectedBlock).subscribe({
      next: (response) => {
        this.filteredUsers = response.data.values.filter(user => 
          user.district === this.selectedDistrict && 
          user.block === this.selectedBlock && 
          user.panchayat === this.selectedPanchayat
        );
      },
      error: (error) => {
        console.error('Error loading users:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load user data. Please try again.'
        });
      }
    });
  }

  onBreadcrumbClick(level: string): void {
    switch (level) {
      case 'district':
        this.currentLevel = 'district';
        this.selectedDistrict = '';
        this.selectedBlock = '';
        this.selectedPanchayat = '';
        break;
      case 'block':
        this.currentLevel = 'block';
        this.selectedBlock = '';
        this.selectedPanchayat = '';
        this.loadBlockSummary();
        break;
      case 'panchayat':
        this.currentLevel = 'panchayat';
        this.selectedPanchayat = '';
        this.loadPanchayatSummary();
        break;
    }
  }

  getCurrentLevelTitle(): string {
    switch (this.currentLevel) {
      case 'block':
        return `Blocks in ${this.selectedDistrict}`;
      case 'panchayat':
        return `Panchayats in ${this.selectedBlock}`;
      case 'users':
        return `PDS Beneficiaries in ${this.selectedPanchayat}`;
      default:
        return '';
    }
  }

  getCurrentLevelSubtitle(): string {
    switch (this.currentLevel) {
      case 'block':
        return `District: ${this.selectedDistrict}`;
      case 'panchayat':
        return `District: ${this.selectedDistrict} | Block: ${this.selectedBlock}`;
      case 'users':
        return `District: ${this.selectedDistrict} | Block: ${this.selectedBlock} | Panchayat: ${this.selectedPanchayat}`;
      default:
        return '';
    }
  }

  getScoreClass(score: number): string {
    if (score >= 40) return 'score-high';
    if (score >= 25) return 'score-medium';
    return 'score-low';
  }

  getTotalScoreClass(totalMark: number): string {
    if (totalMark >= 40) return 'total-high';
    if (totalMark >= 25) return 'total-medium';
    return 'total-low';
  }

  onViewUser(user: PatIndicatorData): void {
    Swal.fire({
      title: 'PAT Indicator Details',
      html: `
        <div style="text-align: left;">
          <h4>${user.username} (${user.pdsNo})</h4>
          <hr>
          <p><strong>Shelter/Home:</strong> ${user.shelterHome}/5</p>
          <p><strong>Special Category (Caste):</strong> ${user.specialCategoryCaste}/5</p>
          <p><strong>Special Category (Social):</strong> ${user.specialCategorySocial}/5</p>
          <p><strong>Income Source:</strong> ${user.incomeSource}/5</p>
          <p><strong>Health:</strong> ${user.health}/5</p>
          <p><strong>Asset-Based Livelihoods:</strong> ${user.assetBasedLivelihoods}/5</p>
          <p><strong>Food Security:</strong> ${user.foodSecurity}/5</p>
          <p><strong>Affected Due to Climate:</strong> ${user.affectedDueToClimate}/5</p>
          <p><strong>Sanitation:</strong> ${user.sanitation}/5</p>
          <p><strong>Livelihood Aspirations:</strong> ${user.livelihoodAspirations}/5</p>
          <hr>
          <p><strong>Total Mark:</strong> <span style="color: ${user.totalMark >= 40 ? '#dc3545' : user.totalMark >= 25 ? '#ffc107' : '#28a745'}">${user.totalMark}/50</span></p>
          <hr>
          <p><strong>Location:</strong> ${user.panchayat}, ${user.block}, ${user.district}</p>
          <p><strong>Last Updated:</strong> ${user.lastUpdated}</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: 'Close',
      width: '600px'
    });
  }

  onBackToDashboard(): void {
    this.router.navigate(['/survey-dashboard']);
  }

  trackByPdsNo(index: number, user: PatIndicatorData): string {
    return user.pdsNo;
  }
}