import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  signUpForm!: FormGroup;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.signUpForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      },
      {
        validator: this.passwordMatchValidator
      }
    )
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.signUpForm.get(controlName);
    return !!((control?.touched || control?.dirty) && control.hasError(errorName));
  }

  onSubmit(): void {
    this.errorMessage = null;
    
    if (this.signUpForm.valid) {
      const newUser = {
        email: this.signUpForm.get('email')?.value,
        password: this.signUpForm.get('password')?.value,
      } as User;
      this.authService.register(newUser).subscribe({
        next: () => {
          this.router.navigate(['transactions']);
        },
        error: (error) => {
          console.log(`Error - ${error}`);
          this.errorMessage = error.error?.message || 'An error occured during sign up. Please try again.'
        }
      });
    }
  }

  private passwordMatchValidator(fg: FormGroup) {
    return fg.get('password')?.value === fg.get('confirmPassword')?.value ? null
      : { passwordMismatch: true };
  }
}
