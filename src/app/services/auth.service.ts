import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_BASE_URL, API_ENDPOINTS } from '../api-endpoints.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly loginUrl = `${API_BASE_URL.replace(/\/$/, '')}${API_ENDPOINTS.auth.googleLogin}`;

  constructor(private readonly router: Router) {}

  loginWithGoogle(): void {
    window.location.href = this.loginUrl;
  }

  handleAuthCallback(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}
