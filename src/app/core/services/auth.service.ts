import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';

const API = 'http://localhost:8000/api';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  async register(email: string, password: string) {
  try {
    await firstValueFrom(
      this.http.post(`${API}/auth/register/`, { username: email, email, password })
    );
    // auto-login after register
    await this.login(email, password);
    this.router.navigate(['/dashboard']);
  } catch (err: any) {
    const message = err?.error?.username?.[0] 
      || err?.error?.email?.[0] 
      || err?.error?.password?.[0]
      || err?.error?.detail
      || 'Registration failed.';
    throw new Error(message);
  }
}

  async login(email: string, password: string) {
    const data: any = await firstValueFrom(
      this.http.post(`${API}/auth/login/`, { username: email, password })
    );
    if (this.isBrowser()) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
    }
    return data;
  }

  async logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('access_token');
  }

  async getCurrentUser() {
    if (!this.getToken()) return null;
    try {
      return await firstValueFrom(this.http.get(`${API}/auth/me/`));
    } catch {
      return null;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    if (!this.isBrowser()) return false;  // ← fixes the SSR crash
    const token = this.getToken();
    if (!token) return false;
    try {
      await this.refreshToken();
      return true;
    } catch {
      return false;
    }
  }

  async refreshToken() {
    if (!this.isBrowser()) throw new Error('No browser');
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token');
    const data: any = await firstValueFrom(
      this.http.post(`${API}/auth/refresh/`, { refresh })
    );
    localStorage.setItem('access_token', data.access);
    return data;
  }
}