import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  token = '';
  constructor(
    // private loader: LoaderService,
    // private sharedService: SharedService
    private router: Router
  ) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Get token from localStorage (where our auth service stores it)
    const token = localStorage.getItem('token');
    const isLoginRequest = request.url.includes('/login'); // Check if it's a login request

    console.log('Interceptor - Request URL:', request.url);
    console.log('Interceptor - Token exists:', !!token);
    console.log('Interceptor - Is login request:', isLoginRequest);

    // Default: no auth header
    let authRequest = request;

    // Add authorization header for non-login requests if token exists
    // But skip for certain APIs that might not require authentication
    const skipAuthApis = [
      '/getDistrict',
      '/getBlock',
      '/getPanchayat', 
      '/getDesignation',
      '/getVillage'
    ];
    
    const shouldSkipAuth = skipAuthApis.some(api => request.url.includes(api));
    
    if (!isLoginRequest && token && !shouldSkipAuth) {
      this.token = token;
      console.log('Interceptor - Adding authorization-token header');
      authRequest = request.clone({
        headers: request.headers
          .set('authorization-token', this.token)
          .append('Accept', 'application/json'),
        responseType: 'json'
      });
    } else if (!isLoginRequest && !token) {
      console.log('Interceptor - No token available for non-login request');
    } else if (shouldSkipAuth) {
      console.log('Interceptor - Skipping auth for API:', request.url);
    }

    const currentUrl = this.router.url;
    sessionStorage.setItem('lastUrlBeforeError', currentUrl);

    return next.handle(authRequest).pipe(
      tap((response) => {
        // Optional loader hide logic
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Interceptor - HTTP Error:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          error: error.error
        });

        if (error.status === 401) {
          console.error('Interceptor - 401 Unauthorized, clearing auth data');
          // Unauthorized - clear auth data and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        }
        if (error.status === 403) {
          // Permission error - could show message or redirect
          console.error('Interceptor - 403 Permission denied');
        }
        if (error.status === 500) {
          console.error('Interceptor - 500 Server error:', error.message);
        }
        if (error.status === 404) {
          console.error('Interceptor - 404 Resource not found:', error.message);
        }
        return throwError(error);
      })
    );
  }
}
