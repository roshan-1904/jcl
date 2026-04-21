import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  fragment?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav [ngClass]="isScrolled ? 'top-4 left-1/2 -translate-x-1/2 w-[95%] rounded-2xl shadow-2xl border border-white/20 bg-white/80' : 'top-0 w-full bg-transparent'"
         class="fixed z-[100] transition-all duration-500 ease-in-out px-6 py-3 flex justify-between items-center backdrop-blur-lg">
      
      <!-- Logo & Credits -->
      <div class="cursor-pointer group flex items-center space-x-4" routerLink="/">
        <div class="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-110">
          <img src="https://www.jcislmmidtown.com/assets/images/logo-default.png" alt="Logo" class="h-12 w-auto object-contain">
        </div>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-1 font-semibold">
        @for (item of navItems; track item.label) {
          <a [routerLink]="item.path" 
             [fragment]="item.fragment"
             routerLinkActive="text-primary active-link"
             [routerLinkActiveOptions]="{exact: item.path === '/'}"
             class="relative px-5 py-2 text-gray-700 hover:text-primary transition-all duration-300 group">
            <span class="relative z-10">{{ item.label }}</span>
            <span class="absolute bottom-1 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-1/2 -translate-x-1/2 rounded-full"></span>
            <span class="absolute inset-0 bg-primary/5 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></span>
          </a>
        }
      </div>

      <!-- Action Button & Mobile Toggle -->
      <div class="flex items-center space-x-4">
        <button class="hidden md:block btn-primary !py-2 !px-7 shadow-primary/30 hover:shadow-primary/50 overflow-hidden relative group">
          <span class="relative z-10">Join Now</span>
          <span class="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
        </button>

        <!-- Mobile Menu Toggle -->
        <button (click)="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden text-2xl text-gray-800 p-2 z-[110] relative transition-transform active:scale-90">
          <i class="fas" [class.fa-times]="isMobileMenuOpen" [class.fa-bars]="!isMobileMenuOpen"></i>
        </button>
      </div>

      <!-- Mobile Menu Overlay Background -->
      <div *ngIf="isMobileMenuOpen" 
           (click)="isMobileMenuOpen = false"
           class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden transition-all animate-fade-in">
      </div>

      <!-- Mobile Menu Content -->
      <div *ngIf="isMobileMenuOpen" 
           class="fixed top-24 left-6 right-6 bg-white/95 backdrop-blur-xl rounded-3xl p-8 flex flex-col space-y-4 md:hidden z-[100] shadow-2xl border border-white/20 animate-slide-in-top origin-top">
        @for (item of navItems; track item.label) {
          <a [routerLink]="item.path" 
             [fragment]="item.fragment"
             (click)="isMobileMenuOpen = false"
             routerLinkActive="text-primary bg-primary/10"
             [routerLinkActiveOptions]="{exact: item.path === '/' && !item.fragment}"
             class="px-6 py-4 rounded-2xl font-bold text-lg text-gray-800 hover:bg-gray-50 flex items-center justify-between group transition-all">
            <span>{{ item.label }}</span>
            <i class="fas fa-chevron-right text-xs text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all"></i>
          </a>
        }
        <div class="pt-4 border-t border-gray-100">
          <button class="btn-primary w-full !py-4 shadow-xl shadow-primary/20">Join Now</button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .active-link span:last-child {
      width: 50% !important;
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    .animate-slide-in-top {
      animation: slideInTop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideInTop {
      from { opacity: 0; transform: translateY(-20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class NavbarComponent {
  isScrolled = false;
  isMobileMenuOpen = false;

  navItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Legacy', path: '/', fragment: 'legacy' },
    { label: 'Team', path: '/members' },
    { label: 'Business', path: '/portfolio' },
    { label: 'Events', path: '/events' },
    { label: 'Contact', path: '/contact' }
  ];
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 20;
    }
  }
}
