import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthResponse } from '../models/authresponse';
import { User } from '../models/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Transaction } from '../models/transaction';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'https://localhost:7068/';

  private currentUserSubject = new BehaviorSubject<string | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const token = localStorage.getItem("token");
    if (token) {
      this.currentUserSubject.next('user');
    }
  }

  login(credentials: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl+`api/auth/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem("token", response.token);
        this.currentUserSubject.next('user');
      })
    );
  }

  register(credentials: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl+`api/auth/register`, credentials).pipe(
      tap((response) => {
        localStorage.setItem("token", response.token);
        this.currentUserSubject.next('user');
      })
    );
  }

  logout(): void {
    localStorage.removeItem("token");
    this.currentUserSubject.next(null);
    this.router.navigate(["/login"]);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }
}
