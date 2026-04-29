import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollReveal } from '../../utils/scroll-reveal';

@Component({
  selector: 'app-legacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="legacy-page-wrapper overflow-hidden bg-[#0a192f] text-slate-300 min-h-screen">
      <!-- DECORATIVE BACKGROUND -->
      <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-900/20 blur-[150px] rounded-full"></div>
        <div class="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
      </div>

      <!-- LEGACY GALLERY SECTION (Top Section) -->
      <section class="relative pt-32 pb-20 px-6 z-10">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <div class="inline-block px-6 py-2 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl reveal-up">
              <span class="text-blue-400 font-black tracking-[0.4em] uppercase text-[10px]">Visual History • Our Legacy in Frames</span>
            </div>
            <h1 class="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight reveal-up">
              The <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Legacy Gallery</span>
            </h1>
            <div class="w-24 h-1.5 bg-blue-500 mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] reveal-up"></div>
          </div>

          <!-- MASONRY-STYLE GRID -->
          <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            @for (img of legacyImages; track img) {
              <div class="break-inside-avoid reveal-up group relative">
                <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-blue-500/20">
                  <img [src]="img" alt="Legacy Image" class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110">
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <p class="text-white font-bold text-sm tracking-widest uppercase">Chapter Memory</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- PAST PRESIDENTS SECTION -->
      <section class="relative py-32 px-6 z-10 bg-white/[0.01]">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div class="reveal-left">
              <h2 class="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                The Pillars of <br><span class="text-blue-500">Our History</span>
              </h2>
              <p class="text-slate-400 text-lg mb-10 leading-relaxed">
                Our Past Presidents are the foundation upon which JCI Salem Midtown stands. Their vision, dedication, and leadership have guided us through 45 years of growth and service.
              </p>
              
              <div class="grid grid-cols-2 gap-6 mb-12">
                <div class="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <h3 class="text-3xl font-black text-white mb-1">45+</h3>
                  <p class="text-xs font-bold text-blue-400 uppercase tracking-widest">Years of Service</p>
                </div>
                <div class="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <h3 class="text-3xl font-black text-white mb-1">40+</h3>
                  <p class="text-xs font-bold text-blue-400 uppercase tracking-widest">Visionary Leaders</p>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <i class="fas fa-history text-xl"></i>
                </div>
                <div>
                  <h4 class="text-white font-bold">Deep Roots</h4>
                  <p class="text-slate-500 text-sm">Building a sustainable future since 1981.</p>
                </div>
              </div>
            </div>

            <div class="reveal-right relative">
              <div class="relative rounded-[4rem] overflow-hidden border-[15px] border-white/5 shadow-2xl group">
                <div class="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors duration-700"></div>
                <img src="assets/image/past_presidents_new (2).png" alt="Past Presidents Legacy" class="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105">
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- OFFICE BEARERS SECTION -->
      <section class="relative py-32 px-6 z-10 bg-white/[0.02]">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div class="reveal-left order-2 lg:order-1 relative">
              <div class="relative rounded-[4rem] overflow-hidden border-[15px] border-white/5 shadow-2xl group">
                <div class="absolute inset-0 bg-indigo-600/10 group-hover:bg-transparent transition-colors duration-700"></div>
                <img src="assets/image/office_bearers_new (1).png" alt="Office Bearers Present" class="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105">
              </div>
            </div>

            <div class="reveal-right order-1 lg:order-2">
              <h2 class="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                The Strength of <br><span class="text-indigo-400">Our Present</span>
              </h2>
              <p class="text-slate-400 text-lg mb-10 leading-relaxed">
                Our Office Bearers are the active engine of Salem Midtown. This dedicated team works tirelessly to execute impactful projects and foster collaboration.
              </p>
              
              <div class="space-y-6">
                <div class="flex items-center space-x-6 p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default">
                  <div class="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <i class="fas fa-users text-2xl"></i>
                  </div>
                  <div>
                    <h4 class="text-white font-black text-lg">Active Leadership</h4>
                    <p class="text-slate-500 text-sm">Driving daily operations and strategic goals.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CALL TO ACTION -->
      <section class="relative py-40 px-6 z-10 text-center overflow-hidden">
        <div class="absolute inset-0 bg-blue-600/5 skew-y-3 transform origin-right"></div>
        <div class="max-w-4xl mx-auto relative">
          <h2 class="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter reveal-up">
            Be Part of the <br><span class="text-blue-500">Next Chapter</span>
          </h2>
          <button class="px-12 py-6 rounded-2xl bg-blue-600 text-white font-black text-lg hover:bg-blue-500 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 reveal-up">
            Join Our Journey
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
    
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.1; transform: scale(1); }
      50% { opacity: 0.2; transform: scale(1.1); }
    }
    
    .animate-pulse { animation: pulse-slow 10s infinite ease-in-out; }
  `]
})
export class LegacyComponent implements AfterViewInit, OnDestroy {
  legacyImages: string[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Generate paths for images 1.jpg to 34.jpg
    for (let i = 1; i <= 34; i++) {
      this.legacyImages.push(`assets/image1/${i}.jpg`);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
    }
  }

  ngOnDestroy() {}

  initAnimations() {
    ScrollReveal.reveal('.reveal-up', 'up');
    ScrollReveal.reveal('.reveal-left', 'left');
    ScrollReveal.reveal('.reveal-right', 'right');
    
    if (isPlatformBrowser(this.platformId)) {
        gsap.from('h1', {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out',
            delay: 0.2
        });
    }
  }
}
