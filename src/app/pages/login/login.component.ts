import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/survey-dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const loginData = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.authService.authenticate(loginData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          if (response && response.success && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // Show success message
            Swal.fire({
              icon: 'success',
              title: 'Login Successful',
              text: `Welcome ${response.user.fullName}! You are logged in as ${response.user.role}.`,
              timer: 2000,
              showConfirmButton: false
            });

            // Navigate to survey dashboard after a short delay
            setTimeout(() => {
              console.log('Attempting to navigate to survey dashboard...');
              this.router.navigate(['/survey-dashboard']).then(success => {
                console.log('Navigation result:', success);
              }).catch(error => {
                console.error('Navigation error:', error);
              });
            }, 1000);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: response?.message || 'Invalid credentials. Please try again.'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          
          console.error('Login error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.message || 'An error occurred during login. Please try again.'
          });
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
