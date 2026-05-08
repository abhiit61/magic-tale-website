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

  isAdmin(): boolean {
    const payload = this.getTokenPayload();
    if (!payload) return false;
    const role = payload['role'] as string | undefined;
    const roles = payload['roles'] as string[] | undefined;
    const authorities = payload['authorities'] as string[] | undefined;
    return (
      role === 'ADMIN' || role === 'admin' ||
      (Array.isArray(roles) && roles.some(r => r === 'ADMIN' || r === 'ROLE_ADMIN')) ||
      (Array.isArray(authorities) && authorities.some(a => a === 'ROLE_ADMIN' || a === 'ADMIN'))
    );
  }

  getCurrentUserEmail(): string | null {
    const payload = this.getTokenPayload();
    if (!payload) return null;
    return (payload['email'] ?? payload['sub']) as string | null;
  }

  getTokenPayload(): Record<string, unknown> | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const base64Payload = token.split('.')[1];
      return JSON.parse(atob(base64Payload));
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}
