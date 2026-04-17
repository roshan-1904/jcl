import { Component, HostListener, Inject, PLATFORM_ID, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import Lenis from 'lenis';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar *ngIf="!isAdminPage()"></app-navbar>
    <main class="min-h-screen">
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="!isAdminPage()"></app-footer>

    <!-- SIDE SCROLL PROGRESS BAR (Vertical Track) -->
    <div *ngIf="!isAdminPage()" class="fixed right-4 top-1/2 -translate-y-1/2 z-[100] h-80 w-8 flex flex-col items-center group hidden md:flex cursor-pointer"
         (mousedown)="startDragging($event)"
         (touchstart)="startDragging($event)"
         #progressBar>
      <!-- Track Background -->
      <div class="absolute inset-y-0 bg-secondary/10 rounded-full w-0.5 mx-auto pointer-events-none">
        <!-- Progress Fill -->
        <div class="w-full bg-primary transition-all duration-150 rounded-full" 
             [style.height.%]="scrollPercentage"></div>
      </div>
      
      <!-- Section Dots (Snap Markers) -->
      <div class="absolute inset-y-0 w-full flex flex-col justify-between items-center py-2 pointer-events-none">
        <div *ngFor="let dot of ['Home', 'About', 'Activities', 'Pillars', 'Team', 'Enquiry']" 
             class="relative group/dot flex items-center justify-center">
          <div class="w-2 h-2 rounded-full border border-primary/30 bg-white transition-all duration-300 group-hover/dot:scale-150 group-hover/dot:bg-primary shadow-sm"></div>
          
          <!-- Section Tooltip -->
          <div class="absolute right-8 px-3 py-1 bg-secondary text-white text-[10px] font-bold rounded-lg opacity-0 group-hover/dot:opacity-100 transition-all transform translate-x-2 group-hover/dot:translate-x-0 pointer-events-none whitespace-nowrap shadow-xl">
            {{ dot }}
            <div class="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-secondary rotate-45"></div>
          </div>
        </div>
      </div>

      <!-- Sliding Icon Thumb -->
      <div class="absolute w-8 h-8 bg-white shadow-xl rounded-full border-2 border-primary flex items-center justify-center transition-all duration-150 transform -translate-x-1/2 left-1/2 hover:scale-125 z-10 pointer-events-none"
           [style.top.%]="scrollPercentage">
        <div class="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
        <i class="fas fa-location-arrow text-[10px] text-primary rotate-[130deg]"></i>
      </div>
    </div>

    <!-- FLOATING SCROLL DOWN ICON (Hero Guide) -->
    <div *ngIf="!isAdminPage()" [class.opacity-0]="showScroll" 
         class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center transition-opacity duration-1000 pointer-events-none">
      <div class="w-[30px] h-[50px] border-2 border-secondary/20 rounded-full relative flex justify-center">
        <div class="w-1.5 h-1.5 bg-primary rounded-full absolute top-2 animate-scroll-mouse"></div>
      </div>
      <span class="text-[9px] font-black text-secondary/30 uppercase tracking-[0.3em] mt-3">Scroll Down</span>
    </div>

    <!-- UNIQUE FLOATING LIQUID SCROLL ICON (To Top) -->
    <div *ngIf="!isAdminPage()" (click)="scrollToTop()" 
         [class.translate-y-0]="showScroll" 
         [class.opacity-100]="showScroll"
         [class.pointer-events-auto]="showScroll"
         class="fixed bottom-10 right-10 z-[99] cursor-pointer group transition-all duration-1000 transform translate-y-32 opacity-0 pointer-events-none active:scale-90">
      
      <div class="relative w-20 h-20 flex items-center justify-center blob-container">
        
        <!-- Multi-layered Glow Backgrounds -->
        <div class="absolute inset-2 bg-primary/30 blur-2xl rounded-full group-hover:bg-primary/50 transition-colors animate-pulse"></div>
        <div class="absolute inset-0 bg-gradient-to-tr from-primary via-secondary to-[#00d2ff] opacity-80 blob-shape animate-morph shadow-[0_20px_50px_rgba(0,198,167,0.3)] group-hover:shadow-[0_25px_60px_rgba(0,198,167,0.5)] transition-shadow"></div>
        
        <!-- Rotating Holographic Ring -->
        <div class="absolute inset-0 border-2 border-white/20 blob-shape animate-spin-slow group-hover:border-white/40 transition-colors"></div>

        <!-- SVG Progress Ring (Layered) -->
        <svg class="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-md p-1">
          <circle cx="40" cy="40" r="34" stroke="white" stroke-width="2" fill="transparent" class="opacity-10" />
          <circle cx="40" cy="40" r="34" stroke="white" stroke-width="3" fill="transparent" 
                  [attr.stroke-dasharray]="214" 
                  [attr.stroke-dashoffset]="214 - (214 * scrollPercentage / 100)"
                  class="transition-all duration-300 ease-out opacity-80" 
                  stroke-linecap="round" />
        </svg>

        <!-- Inner Content (Arrow) -->
        <div class="relative z-10 text-white flex flex-col items-center">
          <div class="overflow-hidden h-6 flex flex-col items-center">
            <i class="fas fa-chevron-up text-xl transform group-hover:-translate-y-8 transition-transform duration-500 ease-in-out"></i>
            <i class="fas fa-chevron-up text-xl transform translate-y-2 group-hover:-translate-y-6 transition-transform duration-500 ease-in-out delay-75"></i>
          </div>
          <span class="text-[8px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mt-1">Top</span>
        </div>

        <!-- Ripple Effect on Hover -->
        <div class="absolute inset-0 rounded-full border-4 border-white/20 scale-50 opacity-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-1000 pointer-events-none"></div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    
    .blob-shape {
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    }

    @keyframes morph {
      0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
      50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    }

    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes scroll-mouse {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(20px); opacity: 0; }
    }

    .blob-container {
      filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
    }

    .animate-morph {
      animation: morph 8s ease-in-out infinite;
    }

    .animate-spin-slow {
      animation: spin-slow 12s linear infinite;
    }

    .animate-scroll-mouse {
      animation: scroll-mouse 2s infinite;
    }
  `],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'jcldemo';
  showScroll = false;
  scrollPercentage = 0;
  private lenis: any;
  private isDragging = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  isAdminPage(): boolean {
    return this.router.url.includes('/admin');
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.initLenis();
        this.initDragListeners();
      });
    }
  }

  private initDragListeners() {
    window.addEventListener('mousemove', (e) => this.onDrag(e));
    window.addEventListener('mouseup', () => this.stopDragging());
    window.addEventListener('touchmove', (e) => this.onDrag(e), { passive: false });
    window.addEventListener('touchend', () => this.stopDragging());
  }

  startDragging(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.onDrag(event);
  }

  private stopDragging() {
    this.isDragging = false;
  }

  private onDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging || !isPlatformBrowser(this.platformId)) return;

    const progressBar = document.querySelector('.fixed.right-4.top-1/2') as HTMLElement;
    if (!progressBar) return;

    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    const rect = progressBar.getBoundingClientRect();
    const y = clientY - rect.top;
    let percentage = (y / rect.height) * 100;
    
    percentage = Math.max(0, Math.min(100, percentage));
    
    const fullHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollTarget = (percentage / 100) * (fullHeight - windowHeight);

    if (this.lenis) {
      this.lenis.scrollTo(scrollTarget, { immediate: true });
    } else {
      window.scrollTo(0, scrollTarget);
    }
  }

  private initLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    this.lenis.on('scroll', (e: any) => {
      this.ngZone.run(() => {
        this.updateScrollProgress(e.scroll);
        this.cdr.detectChanges();
      });
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId) && !this.lenis) {
      this.updateScrollProgress(window.pageYOffset);
    }
  }

  private updateScrollProgress(scrolled: number) {
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;
    this.showScroll = scrolled > 400;
    const totalScrollable = fullHeight - windowHeight;
    this.scrollPercentage = totalScrollable > 0 ? (scrolled / totalScrollable) * 100 : 0;
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.lenis) {
        this.lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  ngOnDestroy() {
    if (this.lenis) {
      this.lenis.destroy();
    }
  }
}
