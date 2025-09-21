import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface PatIndicatorData {
  pdsNo: string;
  username: string;
  shelterHome: number;
  specialCategoryCaste: number;
  specialCategorySocial: number;
  incomeSource: number;
  health: number;
  assetBasedLivelihoods: number;
  foodSecurity: number;
  affectedDueToClimate: number;
  sanitation: number;
  livelihoodAspirations: number;
  totalMark: number;
  district: string;
  block: string;
  panchayat: string;
  lastUpdated: string;
}

export interface PatIndicatorResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    cols: { field: string; header: string }[];
    values: PatIndicatorData[];
    totalRecords: string;
  };
}

export interface DistrictSummary {
  district: string;
  totalUsers: number;
  averageScore: number;
  highVulnerability: number;
  mediumVulnerability: number;
  lowVulnerability: number;
  blocks: BlockSummary[];
}

export interface BlockSummary {
  district: string;
  block: string;
  totalUsers: number;
  averageScore: number;
  highVulnerability: number;
  mediumVulnerability: number;
  lowVulnerability: number;
  panchayats: PanchayatSummary[];
}

export interface PanchayatSummary {
  district: string;
  block: string;
  panchayat: string;
  totalUsers: number;
  averageScore: number;
  highVulnerability: number;
  mediumVulnerability: number;
  lowVulnerability: number;
}

@Injectable({
  providedIn: 'root'
})
export class PatIndicatorService {

  constructor() { }

  getPatIndicatorList(district?: string, block?: string): Observable<PatIndicatorResponse> {
    // Mock data for PAT indicators
    const mockResponse: PatIndicatorResponse = {
      status: true,
      statusCode: 200,
      message: "success!",
      data: {
        cols: [
          { field: "pdsNo", header: "PDS No." },
          { field: "username", header: "Username" },
          { field: "shelterHome", header: "Shelter/Home" },
          { field: "specialCategoryCaste", header: "Special Category (Caste)" },
          { field: "specialCategorySocial", header: "Special Category (Social)" },
          { field: "incomeSource", header: "Income Source" },
          { field: "health", header: "Health" },
          { field: "assetBasedLivelihoods", header: "Asset-Based Livelihoods" },
          { field: "foodSecurity", header: "Food Security" },
          { field: "affectedDueToClimate", header: "Affected Due to Climate" },
          { field: "sanitation", header: "Sanitation" },
          { field: "livelihoodAspirations", header: "Livelihood Aspirations" },
          { field: "totalMark", header: "Total Mark" }
        ],
        values: [
          {
            pdsNo: "TN001234567890",
            username: "Ravi Kumar",
            shelterHome: 3,
            specialCategoryCaste: 2,
            specialCategorySocial: 0,
            incomeSource: 4,
            health: 2,
            assetBasedLivelihoods: 3,
            foodSecurity: 5,
            affectedDueToClimate: 3,
            sanitation: 5,
            livelihoodAspirations: 2,
            totalMark: 29,
            district: "THIRUVANNAMALAI",
            block: "Thiruvannamalai",
            panchayat: "Arunachalam",
            lastUpdated: "2025-01-15 10:30:00"
          },
          {
            pdsNo: "TN001234567891",
            username: "Lakshmi Devi",
            shelterHome: 2,
            specialCategoryCaste: 3,
            specialCategorySocial: 5,
            incomeSource: 5,
            health: 5,
            assetBasedLivelihoods: 4,
            foodSecurity: 5,
            affectedDueToClimate: 2,
            sanitation: 5,
            livelihoodAspirations: 3,
            totalMark: 38,
            district: "THIRUVANNAMALAI",
            block: "Chengam",
            panchayat: "Chengam",
            lastUpdated: "2025-01-14 14:20:00"
          },
          {
            pdsNo: "TN001234567892",
            username: "Muthu Kumar",
            shelterHome: 4,
            specialCategoryCaste: 2,
            specialCategorySocial: 0,
            incomeSource: 3,
            health: 1,
            assetBasedLivelihoods: 2,
            foodSecurity: 3,
            affectedDueToClimate: 1,
            sanitation: 2,
            livelihoodAspirations: 1,
            totalMark: 19,
            district: "THIRUVANNAMALAI",
            block: "Polur",
            panchayat: "Polur",
            lastUpdated: "2025-01-13 09:15:00"
          },
          {
            pdsNo: "TN001234567893",
            username: "Kamala Devi",
            shelterHome: 5,
            specialCategoryCaste: 5,
            specialCategorySocial: 5,
            incomeSource: 5,
            health: 5,
            assetBasedLivelihoods: 5,
            foodSecurity: 5,
            affectedDueToClimate: 5,
            sanitation: 5,
            livelihoodAspirations: 5,
            totalMark: 50,
            district: "THIRUVANNAMALAI",
            block: "Arani",
            panchayat: "Arani",
            lastUpdated: "2025-01-12 16:45:00"
          },
          {
            pdsNo: "TN001234567894",
            username: "Senthil Kumar",
            shelterHome: 1,
            specialCategoryCaste: 1,
            specialCategorySocial: 0,
            incomeSource: 2,
            health: 0,
            assetBasedLivelihoods: 1,
            foodSecurity: 3,
            affectedDueToClimate: 0,
            sanitation: 0,
            livelihoodAspirations: 0,
            totalMark: 8,
            district: "THIRUVANNAMALAI",
            block: "Cheyyar",
            panchayat: "Cheyyar",
            lastUpdated: "2025-01-11 11:30:00"
          },
          {
            pdsNo: "TN001234567895",
            username: "Kannan",
            shelterHome: 3,
            specialCategoryCaste: 2,
            specialCategorySocial: 0,
            incomeSource: 4,
            health: 2,
            assetBasedLivelihoods: 3,
            foodSecurity: 5,
            affectedDueToClimate: 3,
            sanitation: 5,
            livelihoodAspirations: 2,
            totalMark: 29,
            district: "VILLUPURAM",
            block: "Villupuram",
            panchayat: "Villupuram",
            lastUpdated: "2025-01-15 08:20:00"
          },
          {
            pdsNo: "TN001234567896",
            username: "Meera",
            shelterHome: 2,
            specialCategoryCaste: 3,
            specialCategorySocial: 5,
            incomeSource: 5,
            health: 5,
            assetBasedLivelihoods: 4,
            foodSecurity: 5,
            affectedDueToClimate: 2,
            sanitation: 5,
            livelihoodAspirations: 3,
            totalMark: 38,
            district: "VILLUPURAM",
            block: "Tindivanam",
            panchayat: "Tindivanam",
            lastUpdated: "2025-01-14 15:10:00"
          },
          {
            pdsNo: "TN001234567897",
            username: "Suresh",
            shelterHome: 4,
            specialCategoryCaste: 2,
            specialCategorySocial: 0,
            incomeSource: 3,
            health: 1,
            assetBasedLivelihoods: 2,
            foodSecurity: 3,
            affectedDueToClimate: 1,
            sanitation: 2,
            livelihoodAspirations: 1,
            totalMark: 19,
            district: "VILLUPURAM",
            block: "Gingee",
            panchayat: "Gingee",
            lastUpdated: "2025-01-13 12:25:00"
          },
          {
            pdsNo: "TN001234567898",
            username: "Rani",
            shelterHome: 5,
            specialCategoryCaste: 5,
            specialCategorySocial: 5,
            incomeSource: 5,
            health: 5,
            assetBasedLivelihoods: 5,
            foodSecurity: 5,
            affectedDueToClimate: 5,
            sanitation: 5,
            livelihoodAspirations: 5,
            totalMark: 50,
            district: "VILLUPURAM",
            block: "T.V. Nallur",
            panchayat: "Valaiyampattu",
            lastUpdated: "2025-01-12 17:40:00"
          },
          {
            pdsNo: "TN001234567899",
            username: "Prakash",
            shelterHome: 1,
            specialCategoryCaste: 1,
            specialCategorySocial: 0,
            incomeSource: 2,
            health: 0,
            assetBasedLivelihoods: 1,
            foodSecurity: 3,
            affectedDueToClimate: 0,
            sanitation: 0,
            livelihoodAspirations: 0,
            totalMark: 8,
            district: "VILLUPURAM",
            block: "Vanur",
            panchayat: "Vanur",
            lastUpdated: "2025-01-11 13:55:00"
          }
        ],
        totalRecords: "10"
      }
    };

    return of(mockResponse).pipe(delay(500)); // Simulate API call delay
  }

  getPatIndicatorStats(): Observable<{ totalCount: number; averageScore: number; highVulnerability: number }> {
    // Mock statistics
    const stats = {
      totalCount: 40,
      averageScore: 28.5,
      highVulnerability: 12
    };
    
    return of(stats).pipe(delay(300));
  }

  getDistrictSummary(): Observable<DistrictSummary[]> {
    const districtSummary: DistrictSummary[] = [
      {
        district: "THIRUVANNAMALAI",
        totalUsers: 25,
        averageScore: 26.8,
        highVulnerability: 8,
        mediumVulnerability: 12,
        lowVulnerability: 5,
        blocks: [
          {
            district: "THIRUVANNAMALAI",
            block: "Thiruvannamalai",
            totalUsers: 8,
            averageScore: 28.5,
            highVulnerability: 3,
            mediumVulnerability: 4,
            lowVulnerability: 1,
            panchayats: [
              {
                district: "THIRUVANNAMALAI",
                block: "Thiruvannamalai",
                panchayat: "Arunachalam",
                totalUsers: 5,
                averageScore: 29.0,
                highVulnerability: 2,
                mediumVulnerability: 2,
                lowVulnerability: 1
              },
              {
                district: "THIRUVANNAMALAI",
                block: "Thiruvannamalai",
                panchayat: "Thiruvannamalai",
                totalUsers: 3,
                averageScore: 27.7,
                highVulnerability: 1,
                mediumVulnerability: 2,
                lowVulnerability: 0
              }
            ]
          },
          {
            district: "THIRUVANNAMALAI",
            block: "Chengam",
            totalUsers: 6,
            averageScore: 32.3,
            highVulnerability: 2,
            mediumVulnerability: 3,
            lowVulnerability: 1,
            panchayats: [
              {
                district: "THIRUVANNAMALAI",
                block: "Chengam",
                panchayat: "Chengam",
                totalUsers: 6,
                averageScore: 32.3,
                highVulnerability: 2,
                mediumVulnerability: 3,
                lowVulnerability: 1
              }
            ]
          },
          {
            district: "THIRUVANNAMALAI",
            block: "Polur",
            totalUsers: 4,
            averageScore: 19.0,
            highVulnerability: 1,
            mediumVulnerability: 2,
            lowVulnerability: 1,
            panchayats: [
              {
                district: "THIRUVANNAMALAI",
                block: "Polur",
                panchayat: "Polur",
                totalUsers: 4,
                averageScore: 19.0,
                highVulnerability: 1,
                mediumVulnerability: 2,
                lowVulnerability: 1
              }
            ]
          },
          {
            district: "THIRUVANNAMALAI",
            block: "Arani",
            totalUsers: 3,
            averageScore: 50.0,
            highVulnerability: 1,
            mediumVulnerability: 1,
            lowVulnerability: 1,
            panchayats: [
              {
                district: "THIRUVANNAMALAI",
                block: "Arani",
                panchayat: "Arani",
                totalUsers: 3,
                averageScore: 50.0,
                highVulnerability: 1,
                mediumVulnerability: 1,
                lowVulnerability: 1
              }
            ]
          },
          {
            district: "THIRUVANNAMALAI",
            block: "Cheyyar",
            totalUsers: 4,
            averageScore: 8.0,
            highVulnerability: 1,
            mediumVulnerability: 1,
            lowVulnerability: 2,
            panchayats: [
              {
                district: "THIRUVANNAMALAI",
                block: "Cheyyar",
                panchayat: "Cheyyar",
                totalUsers: 4,
                averageScore: 8.0,
                highVulnerability: 1,
                mediumVulnerability: 1,
                lowVulnerability: 2
              }
            ]
          }
        ]
      },
      {
        district: "VILLUPURAM",
        totalUsers: 15,
        averageScore: 30.2,
        highVulnerability: 4,
        mediumVulnerability: 8,
        lowVulnerability: 3,
        blocks: [
          {
            district: "VILLUPURAM",
            block: "Villupuram",
            totalUsers: 5,
            averageScore: 29.0,
            highVulnerability: 1,
            mediumVulnerability: 3,
            lowVulnerability: 1,
            panchayats: [
              {
                district: "VILLUPURAM",
                block: "Villupuram",
                panchayat: "Villupuram",
                totalUsers: 5,
                averageScore: 29.0,
                highVulnerability: 1,
                mediumVulnerability: 3,
                lowVulnerability: 1
              }
            ]
          },
          {
            district: "VILLUPURAM",
            block: "Tindivanam",
            totalUsers: 3,
            averageScore: 38.0,
            highVulnerability: 1,
            mediumVulnerability: 2,
            lowVulnerability: 0,
            panchayats: [
              {
                district: "VILLUPURAM",
                block: "Tindivanam",
                panchayat: "Tindivanam",
                totalUsers: 3,
                averageScore: 38.0,
                highVulnerability: 1,
                mediumVulnerability: 2,
                lowVulnerability: 0
              }
            ]
          },
          {
            district: "VILLUPURAM",
            block: "Gingee",
            totalUsers: 2,
            averageScore: 19.0,
            highVulnerability: 0,
            mediumVulnerability: 1,
            lowVulnerability: 1,
            panchayats: [
              {
                district: "VILLUPURAM",
                block: "Gingee",
                panchayat: "Gingee",
                totalUsers: 2,
                averageScore: 19.0,
                highVulnerability: 0,
                mediumVulnerability: 1,
                lowVulnerability: 1
              }
            ]
          },
          {
            district: "VILLUPURAM",
            block: "T.V. Nallur",
            totalUsers: 3,
            averageScore: 50.0,
            highVulnerability: 1,
            mediumVulnerability: 1,
            lowVulnerability: 1,
            panchayats: [
              {
                district: "VILLUPURAM",
                block: "T.V. Nallur",
                panchayat: "Valaiyampattu",
                totalUsers: 3,
                averageScore: 50.0,
                highVulnerability: 1,
                mediumVulnerability: 1,
                lowVulnerability: 1
              }
            ]
          },
          {
            district: "VILLUPURAM",
            block: "Vanur",
            totalUsers: 2,
            averageScore: 8.0,
            highVulnerability: 1,
            mediumVulnerability: 1,
            lowVulnerability: 0,
            panchayats: [
              {
                district: "VILLUPURAM",
                block: "Vanur",
                panchayat: "Vanur",
                totalUsers: 2,
                averageScore: 8.0,
                highVulnerability: 1,
                mediumVulnerability: 1,
                lowVulnerability: 0
              }
            ]
          }
        ]
      }
    ];

    return of(districtSummary).pipe(delay(500));
  }

  getBlockSummary(district: string): Observable<BlockSummary[]> {
    return this.getDistrictSummary().pipe(
      map(districts => {
        const selectedDistrict = districts.find(d => d.district === district);
        return selectedDistrict ? selectedDistrict.blocks : [];
      })
    );
  }

  getPanchayatSummary(district: string, block: string): Observable<PanchayatSummary[]> {
    return this.getDistrictSummary().pipe(
      map(districts => {
        const selectedDistrict = districts.find(d => d.district === district);
        if (selectedDistrict) {
          const selectedBlock = selectedDistrict.blocks.find(b => b.block === block);
          return selectedBlock ? selectedBlock.panchayats : [];
        }
        return [];
      })
    );
  }
}
