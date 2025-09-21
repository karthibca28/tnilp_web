import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface UserColumn {
  field: string;
  header: string;
}

export interface UserData {
  sno: number;
  userId: string;
  name: string;
  mobile: string;
  email: string | null;
  district: string;
  block: string;
  panchayat: string;
  userLevel: string;
  target: string;
  lastLogin: string | null;
  isActive: string;
}

export interface UserListResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    cols: UserColumn[];
    values: UserData[];
    totalRecords: string;
  };
}

export interface UserListParams {
  userLevel?: string;
  districtId?: string;
  fromDate?: string;
  toDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserList(userLevel: string = '', districtId: string = '', fromDate: string = '', toDate: string = ''): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Adminrural/getUserList?userLevel=${userLevel}&districtId=${districtId}&fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  // Mock data for development/testing
  getMockUserList(): Observable<UserListResponse> {
    const mockResponse: UserListResponse = {
      status: true,
      statusCode: 200,
      message: "success!",
      data: {
        cols: [
          { field: "sno", header: "Sno" },
          { field: "name", header: "Name" },
          { field: "mobile", header: "Mobile" },
          { field: "email", header: "Email" },
          { field: "district", header: "District" },
          { field: "block", header: "Block" },
          { field: "panchayat", header: "Panchayat" },
          { field: "userLevel", header: "User Level" },
          { field: "target", header: "Target" },
          { field: "lastLogin", header: "Last Login" }
        ],
        values: [
          // Thiruvannamalai District Users
          {
            sno: 1,
            userId: "1",
            name: "Ravi Kumar",
            mobile: "9876543210",
            email: "ravi@thiruvannamalai.gov.in",
            district: "THIRUVANNAMALAI",
            block: "Thiruvannamalai",
            panchayat: "Arunachalam",
            userLevel: "primary",
            target: "500",
            lastLogin: "2025-01-15 10:30:00",
            isActive: "1"
          },
          {
            sno: 2,
            userId: "2",
            name: "Senthil Kumar",
            mobile: "8765432109",
            email: "senthil@thiruvannamalai.gov.in",
            district: "THIRUVANNAMALAI",
            block: "Chengam",
            panchayat: "Chengam",
            userLevel: "primary",
            target: "450",
            lastLogin: "2025-01-14 14:20:00",
            isActive: "1"
          },
          {
            sno: 3,
            userId: "3",
            name: "Lakshmi Devi",
            mobile: "7654321098",
            email: "lakshmi@thiruvannamalai.gov.in",
            district: "THIRUVANNAMALAI",
            block: "Polur",
            panchayat: "Polur",
            userLevel: "secondary",
            target: "300",
            lastLogin: "2025-01-13 09:15:00",
            isActive: "1"
          },
          {
            sno: 4,
            userId: "4",
            name: "Muthu Kumar",
            mobile: "6543210987",
            email: "muthu@thiruvannamalai.gov.in",
            district: "THIRUVANNAMALAI",
            block: "Arani",
            panchayat: "Arani",
            userLevel: "primary",
            target: "400",
            lastLogin: "2025-01-12 16:45:00",
            isActive: "0"
          },
          {
            sno: 5,
            userId: "5",
            name: "Kamala Devi",
            mobile: "5432109876",
            email: "kamala@thiruvannamalai.gov.in",
            district: "THIRUVANNAMALAI",
            block: "Cheyyar",
            panchayat: "Cheyyar",
            userLevel: "primary",
            target: "350",
            lastLogin: "2025-01-11 11:30:00",
            isActive: "1"
          },
          // Villupuram District Users
          {
            sno: 6,
            userId: "6",
            name: "Kannan",
            mobile: "4321098765",
            email: "kannan@villupuram.gov.in",
            district: "VILLUPURAM",
            block: "Villupuram",
            panchayat: "Villupuram",
            userLevel: "primary",
            target: "600",
            lastLogin: "2025-01-15 08:20:00",
            isActive: "1"
          },
          {
            sno: 7,
            userId: "7",
            name: "Meera",
            mobile: "3210987654",
            email: "meera@villupuram.gov.in",
            district: "VILLUPURAM",
            block: "Tindivanam",
            panchayat: "Tindivanam",
            userLevel: "primary",
            target: "550",
            lastLogin: "2025-01-14 15:10:00",
            isActive: "1"
          },
          {
            sno: 8,
            userId: "8",
            name: "Suresh",
            mobile: "2109876543",
            email: "suresh@villupuram.gov.in",
            district: "VILLUPURAM",
            block: "Gingee",
            panchayat: "Gingee",
            userLevel: "secondary",
            target: "400",
            lastLogin: "2025-01-13 12:25:00",
            isActive: "1"
          },
          {
            sno: 9,
            userId: "9",
            name: "Rani",
            mobile: "1098765432",
            email: "rani@villupuram.gov.in",
            district: "VILLUPURAM",
            block: "T.V. Nallur",
            panchayat: "Valaiyampattu",
            userLevel: "primary",
            target: "500",
            lastLogin: "2025-01-12 17:40:00",
            isActive: "0"
          },
          {
            sno: 10,
            userId: "10",
            name: "Prakash",
            mobile: "0987654321",
            email: "prakash@villupuram.gov.in",
            district: "VILLUPURAM",
            block: "Vanur",
            panchayat: "Vanur",
            userLevel: "primary",
            target: "450",
            lastLogin: "2025-01-11 13:55:00",
            isActive: "1"
          }
        ],
        totalRecords: "20"
      }
    };

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockResponse);
        observer.complete();
      }, 1000); // Simulate API delay
    });
  }
}
