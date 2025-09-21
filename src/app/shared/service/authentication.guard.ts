import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('=== AUTHENTICATION GUARD DEBUG ===');
    console.log('AuthenticationGuard - Token exists:', !!token);
    console.log('AuthenticationGuard - User exists:', !!user);
    console.log('AuthenticationGuard - Current route:', this.router.url);
    console.log('AuthenticationGuard - Token value:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('AuthenticationGuard - User value:', user ? JSON.parse(user).username : 'null');
    console.log('===================================');
    
    // Check if user is authenticated using the auth service
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('AuthenticationGuard - AuthService says authenticated:', isAuthenticated);
    
    if (isAuthenticated) {
      console.log('AuthenticationGuard - User is authenticated, allowing access');
      return true;
    }
    
    console.log('AuthenticationGuard - User not authenticated, redirecting to login');
    this.router.navigateByUrl("/login");  
    return false;
  }
}
