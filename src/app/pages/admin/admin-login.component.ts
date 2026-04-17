import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-6">
      <div class="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        <div class="bg-gradient-to-r from-[#00c6a7] to-[#0f4c75] p-8 text-white text-center">
          <div class="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
            <img src="https://www.jcislmmidtown.com/assets/images/logo-default.png" alt="Logo" class="h-12 w-auto object-contain filter brightness-0 invert">
          </div>
          <h2 class="text-3xl font-black mb-2">Admin Portal</h2>
          <p class="opacity-80">Please login to access the dashboard</p>
        </div>
        
        <form (ngSubmit)="login()" class="p-8 space-y-6">
          <div *ngIf="loginError" class="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
            {{ loginError }}
          </div>
          
          <div>
            <label class="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">Username</label>
            <input type="text" [(ngModel)]="credentials.username" name="username" 
                   class="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                   placeholder="Enter username">
          </div>
          
          <div>
            <label class="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">Password</label>
            <input type="password" [(ngModel)]="credentials.password" name="password" 
                   class="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                   placeholder="Enter password">
          </div>
          
          <button type="submit" 
                  class="w-full bg-gradient-to-r from-[#00c6a7] to-[#0f4c75] text-white py-4 rounded-xl font-black text-lg shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all">
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  credentials = { username: '', password: '' };
  loginError = '';

  constructor(private eventService: EventService, private router: Router) {}

  login() {
    this.eventService.login(this.credentials).subscribe({
      next: (res) => {
        if (res.success) {
          localStorage.setItem('admin_logged_in', 'true');
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: () => {
        this.loginError = 'Invalid username or password';
      }
    });
  }
}
