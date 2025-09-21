import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface District {
  id: string;
  districtCode: string;
  name: string;
}

export interface Block {
  blockId: string;
  districtId: string;
  blockCode: string;
  blockName: string;
}

export interface Panchayat {
  panchayatId: string;
  blockId: string;
  panchayatCode: string;
  panchayatName: string;
}

export interface Designation {
  designationId: string;
  name: string;
}

export interface UserLevel {
  id: string;
  name: string;
}

export interface RoleType {
  id: number;
  name: string;
}

export interface ApiResponse<T> {
  code?: string;
  message: string;
  statusCode: number;
  success: boolean;
  status?: boolean;
  data: T[];
}

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDistricts(): Observable<ApiResponse<District>> {
    return this.http.get<ApiResponse<District>>(`${this.baseUrl}/Adminrural/getDistrict`);
  }

  getBlocks(districtId: string): Observable<ApiResponse<Block>> {
    return this.http.get<ApiResponse<Block>>(`${this.baseUrl}/Adminrural/getBlock?districtId=${districtId}`);
  }

  getPanchayats(blockId: string): Observable<ApiResponse<Panchayat>> {
    return this.http.get<ApiResponse<Panchayat>>(`${this.baseUrl}/Adminrural/getPanchayat?blockId=${blockId}`);
  }

  getDesignations(): Observable<ApiResponse<Designation>> {
    return this.http.get<ApiResponse<Designation>>(`${this.baseUrl}/Adminrural/getDesignation`);
  }

  getUserLevels(): Observable<ApiResponse<UserLevel>> {
    return this.http.get<ApiResponse<UserLevel>>(`${this.baseUrl}/Adminrural/getVillage?panchayatId=additional`);
  }

  getRoleTypes(): Observable<ApiResponse<RoleType>> {
    return this.http.get<ApiResponse<RoleType>>(`${this.baseUrl}/Admin/getRoleType`);
  }
}
