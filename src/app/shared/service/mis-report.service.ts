import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface TableColumn {
  field: string;
  header: string;
}

export interface MisReportData {
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

export interface MisReportResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    cols: TableColumn[];
    values: MisReportData[];
  };
}

export interface MisReportFilters {
  districtId?: string;
  blockId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MisReportService {
  // private baseUrl = `${environment.apiUrl}Adminrural/getRuralCompletedSurveyMarkList`;
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // admin dashboard
  getDashboardAdmin(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Dashboard/admin`
    );
  }
  getpdsDataList(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Rurallist/getpdsDataList`
    );
  }
  getWithoutpdsDataList(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Rurallist/getWithoutpdsDataList`
    );
  }
  getpdsNotAvailableDataList(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Rurallist/getpdsNotAvailableDataList`
    );
  }
  getPersonNotAvailableList(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Rurallist/getPersonNotAvailableList`
    );
  }
  getHomeLessDetailsList(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Rurallist/getHomeLessDetailsList`
    );
  }

  getMarkList(districtId: string = '', blockId: string = '', fromDate: string = '', toDate: string = '', page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Adminrural/getRuralCompletedSurveyMarkList?districtId=${districtId}&blockId=${blockId}&fromDate=${fromDate}&toDate=${toDate}&page=${page}&limit=${limit}`
    );
  }

  getInduvutalMarkList(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Adminrural/getRuralSurveyMarkDetail?id=${id}`
    );
  }
  
  getMisReportData(filters: MisReportFilters): Observable<MisReportResponse> {
    let params = new HttpParams();
    
    // Add pagination parameters
    if (filters.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.limit) {
      params = params.set('limit', filters.limit.toString());
    }
    
    // Add filter parameters
    if (filters.districtId) {
      params = params.set('district_id', filters.districtId);
    }
    if (filters.blockId) {
      params = params.set('blockId', filters.blockId);
    }
    if (filters.fromDate) {
      params = params.set('fromDate', filters.fromDate);
    }
    if (filters.toDate) {
      params = params.set('toDate', filters.toDate);
    }

    return this.http.get<MisReportResponse>(this.baseUrl, { params });
  }

  /**
   * Get mis report summary statistics
   */
  getMisReportSummary(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Adminrural/getMisReportSummary`);
  }

  /**
   * Export mis report data
   */
  exportMisReportData(filters: MisReportFilters, format: 'excel' | 'csv' | 'pdf' = 'excel'): Observable<Blob> {
    let params = new HttpParams();
    
    // Add all filter parameters
    if (filters.districtId) {
      params = params.set('district_id', filters.districtId);
    }
    if (filters.blockId) {
      params = params.set('blockId', filters.blockId);
    }
    if (filters.fromDate) {
      params = params.set('fromDate', filters.fromDate);
    }
    if (filters.toDate) {
      params = params.set('toDate', filters.toDate);
    }
    
    // Add export format
    params = params.set('format', format);

    return this.http.get(`${environment.apiUrl}Adminrural/exportMisReport`, { 
      params,
      responseType: 'blob'
    });
  }
}
