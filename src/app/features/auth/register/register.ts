import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  email = '';
  password = '';
  confirm = '';
  error = '';
  success = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  async register() {
    if (!this.email || !this.password || !this.confirm) {
      this.error = 'Please fill in all fields.';
      return;
    }
    if (this.password !== this.confirm) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      await this.auth.register(this.email, this.password);
      this.success = 'Account created! Please check your email to confirm.';
    } catch (err: any) {
      this.error = err.message || 'Registration failed.';
    } finally {
      this.loading = false;
    }
  }
}