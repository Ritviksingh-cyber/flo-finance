import { Injectable } from '@angular/core';
import { supabase } from '../supabase';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router) {}

  async register(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async logout() {
    await supabase.auth.signOut();
    this.router.navigate(['/login']);
  }

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  async isLoggedIn(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }
}