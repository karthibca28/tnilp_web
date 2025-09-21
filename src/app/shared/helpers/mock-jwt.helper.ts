import { Injectable } from '@angular/core';

export interface MockUser {
  id: number;
  username: string;
  password?: string; // Optional for security reasons
  email: string;
  role: string;
  fullName: string;
  department: string;
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
}

export interface MockJwtPayload {
  sub: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
  department: string;
  permissions: string[];
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockJwtHelper {
  
  /**
   * Generate a mock JWT token (simplified version for development)
   * In production, this would be handled by the backend
   */
  generateMockToken(user: MockUser): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload: MockJwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      department: user.department,
      permissions: user.permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    // Simple base64 encoding for mock purposes
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    const signature = this.generateMockSignature(encodedHeader, encodedPayload);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * Decode a mock JWT token
   */
  decodeMockToken(token: string): MockJwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(this.base64UrlDecode(parts[1]));
      
      // Check if token is expired
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is valid and not expired
   */
  isTokenValid(token: string): boolean {
    const payload = this.decodeMockToken(token);
    return payload !== null;
  }

  /**
   * Get user info from token
   */
  getUserFromToken(token: string): MockUser | null {
    const payload = this.decodeMockToken(token);
    if (!payload) {
      return null;
    }

    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      fullName: payload.fullName,
      department: payload.department,
      permissions: payload.permissions,
      lastLogin: new Date().toISOString(),
      isActive: true
    };
  }

  private base64UrlEncode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private base64UrlDecode(str: string): string {
    // Add padding if needed
    str += '==='.slice((str.length + 3) % 4);
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    return atob(str);
  }

  private generateMockSignature(header: string, payload: string): string {
    // Simple mock signature for development
    const data = header + '.' + payload;
    const mockSecret = 'mtc-erp-secret-key-2025';
    return this.base64UrlEncode(btoa(data + mockSecret).substring(0, 32));
  }
}
