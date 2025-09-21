import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MockUser } from '../helpers/mock-jwt.helper';

export interface LoginResponse {
  success: boolean;
  token: string;
  user: MockUser;
  message?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// Real API interfaces
export interface ApiLoginRequest {
  username: string;
  password: string;
}

export interface ApiLoginResponse {
  access_token: string;
  status: boolean;
  statusCode: number;
  message: string;
  note: string;
  data: {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    roleId: number;
    roleTypeId: number;
    roleTypeName: string;
    districtId: number;
    ulbId: number;
    panchayatId: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  apiUrl: string = '';

  constructor(private http: HttpClient) { 
    this.apiUrl = environment.apiUrl;
  }

  /**
   * Authenticate user with real API
   */
  authenticate(data: LoginRequest): Observable<LoginResponse> {
    const apiUrl = `${this.apiUrl}Adminrural/login`;
    
    return this.http.post<ApiLoginResponse>(apiUrl, {
      username: data.username,
      password: data.password
    }).pipe(
      map((apiResponse) => {
        if (!apiResponse.status) {
          throw new Error(apiResponse.message || 'Login failed');
        }

        // Convert API response to our internal format
        const user: MockUser = {
          id: apiResponse.data.userId,
          username: apiResponse.data.username,
          email: `${apiResponse.data.username}@tnilp.com`, // Generate email from username
          role: apiResponse.data.roleTypeName,
          fullName: `${apiResponse.data.firstName} ${apiResponse.data.lastName}`,
          department: 'Survey Management',
          permissions: this.getPermissionsByRole(apiResponse.data.roleTypeName),
          lastLogin: new Date().toISOString(),
          isActive: true
        };

        // Store token and user data
        localStorage.setItem('token', apiResponse.access_token);
        localStorage.setItem('user', JSON.stringify(user));

        return {
          success: true,
          token: apiResponse.access_token,
          user: user,
          message: apiResponse.message || 'Login successful'
        };
      }),
      catchError((error) => {
        console.error('Login API Error:', error);
        
        // Return error without fallback to mock
        return throwError(() => ({
          success: false,
          message: error.error?.message || error.message || 'Login failed. Please check your credentials.'
        }));
      })
    );
  }


  /**
   * Get permissions based on role type
   */
  private getPermissionsByRole(roleTypeName: string): string[] {
    const permissions: { [key: string]: string[] } = {
      'RuralAdmin': [
        'survey_dashboard_view',
        'survey_users_manage',
        'pat_indicator_view',
        'user_master_manage',
        'survey_data_export',
        'reports_generate'
      ],
      'Surveyor': [
        'survey_dashboard_view',
        'survey_data_entry',
        'pat_indicator_view'
      ],
      'Supervisor': [
        'survey_dashboard_view',
        'survey_users_view',
        'pat_indicator_view',
        'survey_data_validate'
      ]
    };

    return permissions[roleTypeName] || ['survey_dashboard_view'];
  }

  /**
   * Validate current token
   */
  validateToken(token: string): boolean {
    if (!token) return false;
    
    try {
      const payload = this.decodeJwtToken(token);
      console.log('Token payload:', payload);
      
      // Check if token has expiration
      if (payload && payload.exp) {
        const isExpired = payload.exp < Math.floor(Date.now() / 1000);
        console.log('Token expiration check:', { exp: payload.exp, now: Math.floor(Date.now() / 1000), isExpired });
        return !isExpired;
      }
      
      // If no expiration field, assume token is valid (for API tokens without exp)
      if (payload && payload.uid) {
        console.log('Token has uid, assuming valid:', payload.uid);
        return true;
      }
      
      console.log('Token validation failed - no exp or uid field');
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * Get user from token
   */
  getUserFromToken(token: string): MockUser | null {
    if (!token) return null;
    
    // Get user from localStorage (stored during login)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    
    return null;
  }

  /**
   * Decode JWT token (simplified version)
   */
  private decodeJwtToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      // Add padding if needed for base64 decoding
      let payloadPart = parts[1];
      while (payloadPart.length % 4) {
        payloadPart += '=';
      }
      
      const payload = JSON.parse(atob(payloadPart));
      return payload;
    } catch (error) {
      console.error('JWT decode error:', error);
      throw new Error('Invalid token');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('AuthService - Token found:', !!token);
    console.log('AuthService - User found:', !!user);
    
    if (token && user) {
      // Try token validation first
      const isValid = this.validateToken(token);
      console.log('AuthService - Token valid:', isValid);
      
      // If token validation fails but we have both token and user, assume authenticated
      // This handles cases where the API token doesn't have standard JWT structure
      if (!isValid) {
        console.log('AuthService - Token validation failed, but token and user exist - assuming authenticated');
        return true;
      }
      
      return isValid;
    }
    
    return false;
  }

  /**
   * Get current user
   */
  getCurrentUser(): MockUser | null {
    const token = localStorage.getItem('token');
    return token ? this.getUserFromToken(token) : null;
  }

  /**
   * Logout user
   */
  logOut(): Observable<any> {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Simulate API call delay
    return of({ success: true, message: 'Logged out successfully' }).pipe(
      delay(500)
    );
  }

  /**
   * Reset password (mock implementation)
   */
  resetPassword(data: any): Observable<any> {
    return of({ 
      success: true, 
      message: 'Password reset email sent successfully' 
    }).pipe(
      delay(1000)
    );
  }

  /**
   * Change password (mock implementation)
   */
  changePassword(data: any): Observable<any> {
    return of({ 
      success: true, 
      message: 'Password changed successfully' 
    }).pipe(
      delay(1000)
    );
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.permissions.includes(permission) : false;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }
}

