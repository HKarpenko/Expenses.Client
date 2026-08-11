import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  loginForm!: FormGroup;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      }
    )
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!((control?.touched || control?.dirty) && control.hasError(errorName));
  }

  onSubmit(): void {
    this.errorMessage = null;
    
    if (this.loginForm.valid) {
      const user = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      } as User;
      this.authService.login(user).subscribe({
        next: () => {
          this.router.navigate(['transactions']);
        },
        error: (error) => {
          console.log(`Error - ${error}`);
          this.errorMessage = error.error?.message || 'An error occured during login. Please try again.'
        }
      });
    }
  }
}
