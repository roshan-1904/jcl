import { Component, AfterViewInit, Inject, PLATFORM_ID, NgZone, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { ScrollReveal } from '../../utils/scroll-reveal'; 
import { EventService, Event, TeamMember } from '../../services/event.service';
import { interval, Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- CINEMATIC ADVANCED HERO SECTION -->
    <section class="relative min-h-[100svh] flex flex-col items-center justify-center pt-24 md:pt-28 overflow-hidden">
      <!-- Background Image Slider -->
      <div class="absolute inset-0 z-[-1]">
        @for (img of heroImages; track $index) {
          <div class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
               [class.opacity-100]="currentImageIndex === $index"
               [class.opacity-0]="currentImageIndex !== $index">
            <img [src]="img" class="w-full h-full object-cover scale-105" alt="Background">
            <!-- Dark Overlay for Readability -->
            <div class="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
          </div>
        }
        
        <!-- Animated Shards & Mesh Overlays -->
        <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div class="parallax-shards absolute inset-0">
          <div class="shard shard-1 hidden sm:block"></div>
          <div class="shard shard-2 hidden sm:block"></div>
          <div class="shard shard-3 hidden sm:block"></div>
          <div class="shard shard-4 hidden sm:block"></div>
        </div>
      </div>

      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10 w-full pb-10 md:pb-20">
        <div class="flex flex-col items-center text-center">
          
          <!-- CONTENT SECTION -->
          <div class="hero-content-wrapper max-w-5xl px-2 sm:px-4">
            <div class="inline-block px-4 sm:px-8 py-2 sm:py-3 mb-6 sm:mb-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-3xl opacity-0 hero-slide-up shadow-[0_0_40px_rgba(255,255,255,0.1)]">
               <span class="text-primary font-black tracking-[0.3em] sm:tracking-[0.6em] uppercase text-[9px] sm:text-[11px] glow-text whitespace-nowrap">JCI Salem Midtown • Excellence Redefined</span>
            </div>

            <h1 class="heading-huge mb-6 sm:mb-10 overflow-hidden text-white">
              <span class="block opacity-0 hero-title-line mb-2">Empowering</span>
              <span class="block opacity-0 hero-title-line gradient-text-v2 neon-glow">Global Leaders</span>
            </h1>

            <p class="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 sm:mb-16 leading-relaxed opacity-0 hero-fade-in font-medium px-4">
              Developing leadership, social responsibility, and entrepreneurship to create <span class="text-white font-bold border-b-2 sm:border-b-4 border-primary/50">positive global change.</span>
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 hero-fade-in px-4">
              <!-- Glass Container for CTA -->
              <div class="p-1.5 sm:p-2 bg-white/5 backdrop-blur-2xl rounded-[2rem] sm:rounded-[3rem] border border-white/10 shadow-2xl flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <button (click)="scrollToEnquiry()" class="group relative px-6 sm:px-10 py-4 sm:py-5 overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] bg-primary font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,198,167,0.3)] hover:shadow-[0_25px_50px_rgba(0,198,167,0.5)] w-full sm:w-auto">
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span class="relative z-10 flex items-center justify-center gap-3 text-base sm:text-lg">
                    <i class="fas fa-rocket text-xs sm:text-sm"></i>
                    Join Movement
                  </span>
                </button>
                
                <a routerLink="/about" class="group px-6 sm:px-10 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white/10 hover:bg-white text-white hover:text-secondary transition-all duration-500 font-bold backdrop-blur-md flex items-center justify-center gap-3 border border-white/20 w-full sm:w-auto text-base sm:text-lg">
                  Our Story 
                  <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 group-hover:bg-secondary/10 flex items-center justify-center transition-colors">
                    <i class="fas fa-chevron-right text-[10px] sm:text-xs group-hover:translate-x-1 transition-transform"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <!-- Slider Dots -->
          <div class="flex space-x-3 sm:space-x-4 mt-12 sm:mt-20 opacity-0 hero-fade-in">
            @for (img of heroImages; track $index) {
              <button (click)="currentImageIndex = $index" 
                      class="w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-500 border-2 border-white/50"
                      [class.bg-white]="currentImageIndex === $index"
                      [class.scale-125]="currentImageIndex === $index"
                      [class.bg-transparent]="currentImageIndex !== $index"></button>
            }
          </div>

        </div>
      </div>

      <!-- Wave Transition -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] translate-y-1">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="relative block w-[calc(100%+1.3px)] h-[60px] sm:h-[100px] fill-[#f5f7fa]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.47,110.19,121,124.09,188.85,124.09,252.33,124.09,285,110.19,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>

    <!-- IG VIDEO & ABOUT -->
    <section class="py-12 sm:py-20 px-4 sm:px-6 max-w-[1600px] mx-auto relative section-reveal">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-24 items-center">
        <!-- Text Content (Left) -->
        <div class="reveal-left order-2 lg:order-1 px-2">
          <h2 class="text-[10px] sm:text-xs font-black text-primary tracking-[0.3em] sm:tracking-[0.5em] uppercase mb-4 sm:mb-6 flex items-center">
            <span class="w-6 sm:w-8 h-[1px] bg-primary mr-3 sm:mr-4"></span> JCI Salem Midtown
          </h2>
          <h3 class="text-4xl sm:text-5xl md:text-7xl font-black text-secondary mb-6 sm:mb-8 leading-[1.1] tracking-tighter">
            Leadership <br><span class="gradient-text">Since 1981</span>
          </h3>
          <p class="text-gray-500 text-lg sm:text-xl mb-8 sm:mb-12 leading-relaxed font-medium">
            At JCI Salem Mid Town, we are dedicated to empowering young leaders, fostering community development, and driving positive change. Join us in our mission to create a better tomorrow through impactful leadership, innovation, and collaboration.
          </p>
          <div class="space-y-4 sm:space-y-6">
            <div class="group flex items-center space-x-4 sm:space-x-6 bg-white p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-2xl hover:border-primary/20 transition-all duration-500">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl sm:text-2xl group-hover:scale-110 transition-transform"><i class="fas fa-bolt"></i></div>
              <div class="flex-1">
                <p class="font-black text-secondary text-base sm:text-lg">Impactful Programs</p>
                <p class="text-gray-400 text-xs sm:text-sm">Empowering through action and education.</p>
              </div>
            </div>
            <div class="group flex items-center space-x-4 sm:space-x-6 bg-white p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-2xl hover:border-secondary/20 transition-all duration-500">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary text-xl sm:text-2xl group-hover:scale-110 transition-transform"><i class="fas fa-globe"></i></div>
              <div class="flex-1">
                <p class="font-black text-secondary text-lg">Global Connectivity</p>
                <p class="text-gray-400 text-xs sm:text-sm">Building bridges across borders.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Image Content (Right) -->
        <div class="reveal-right order-1 lg:order-2 px-2">
          <div class="relative group perspective-container">
            <div class="absolute -inset-4 sm:-inset-8 bg-gradient-to-tr from-primary to-secondary opacity-20 blur-[40px] sm:blur-[80px] group-hover:opacity-40 transition-opacity duration-1000"></div>
            <div class="relative rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl border-[8px] sm:border-[12px] border-white bg-black transform hover:-rotate-y-6 transition-all duration-700 h-[60vh] sm:h-[80vh] lg:h-[90vh]">
              <img src="https://images.unsplash.com/photo-1499209974431-966ce4581a5b?w=3840&q=100" 
                   alt="JCI Community Service and Leadership Impact" 
                   class="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div class="absolute bottom-8 left-8 right-8 text-white">
                <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h4 class="text-2xl font-bold mb-2">Empowering Leaders</h4>
                  <p class="text-white/90">Building tomorrow's leaders through action and impact</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- IMPACT INITIATIVES SECTION -->
    <section class="py-12 sm:py-20 bg-[#fdfdfd] px-4 sm:px-6 relative overflow-hidden section-reveal">
      <div class="max-w-[1600px] mx-auto">
        <div class="text-center mb-10 sm:mb-16 reveal-up">
          <h2 class="text-4xl sm:text-5xl md:text-7xl font-black text-secondary tracking-tighter">Impactful <span class="gradient-text">Initiatives</span></h2>
          <div class="w-20 sm:w-24 h-1.5 sm:h-2 bg-primary mx-auto mt-4 sm:mt-6 rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
          @for (item of activities; track item.text; let i = $index) {
            <div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-8 group reveal-up" [style.transition-delay]="i * 100 + 'ms'">
              <div class="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-3">
                <img [src]="item.image" [alt]="item.text" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
                <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div class="flex-1 pt-0 sm:pt-2">
                <p class="text-primary font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2 sm:mb-3">Initiative {{ i + 1 }}</p>
                <h4 class="text-secondary font-black text-xl sm:text-2xl mb-2 sm:mb-3 group-hover:text-primary transition-colors leading-tight">{{ item.text.split(':')[0] }}</h4>
                <p class="text-gray-400 font-medium leading-relaxed text-sm sm:text-base">{{ item.text.split(':')[1] || item.text }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- HOLOGRAPHIC PILLARS (Advanced Professional Design) -->
    <section class="py-12 sm:py-20 bg-white relative overflow-hidden section-reveal">
      <!-- Decorative Background Text -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 opacity-[0.02] text-[15rem] font-black pointer-events-none select-none whitespace-nowrap">FOUNDATION</div>

      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 text-center mb-10 sm:mb-20">
        <p class="text-primary font-black tracking-[0.4em] uppercase text-[10px] mb-4">The Foundation of JCI</p>
        <h2 class="heading-xl text-secondary tracking-tighter">Our Core <span class="gradient-text">Pillars</span></h2>
        <div class="w-24 sm:w-32 h-1 bg-gradient-to-r from-primary via-secondary to-primary mx-auto mt-6 rounded-full shadow-2xl"></div>
      </div>
      
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        
        <!-- Pillar 1: Leadership -->
        <div class="group relative card-reveal p-10 rounded-[3rem] bg-gray-50 border border-gray-100 overflow-hidden transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.07)] hover:-translate-y-3">
          <div class="absolute top-6 right-10 text-6xl font-black text-gray-200/40 group-hover:text-primary/10 transition-colors">01</div>
          <div class="relative z-10">
            <div class="relative w-20 h-20 mb-10 group-hover:scale-110 transition-transform duration-500">
              <div class="absolute inset-0 bg-primary/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all"></div>
              <div class="relative w-full h-full bg-primary text-white rounded-[1.8rem] flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-6 transition-all duration-500">
                <i class="fas fa-graduation-cap text-4xl"></i>
              </div>
            </div>
            <h3 class="text-2xl font-black mb-4 text-secondary tracking-tight group-hover:text-primary transition-colors">Leadership</h3>
            <p class="text-gray-500 leading-relaxed text-lg font-medium">Creating the visionaries and change-makers who will shape the future of our global society.</p>
            <div class="mt-8 flex items-center text-primary font-black text-[11px] tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0 transition-all">
              Learn Impact <i class="fas fa-arrow-right ml-3"></i>
            </div>
          </div>
        </div>

        <!-- Pillar 2: Business -->
        <div class="group relative card-reveal p-10 rounded-[3rem] bg-gray-50 border border-gray-100 overflow-hidden transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.07)] hover:-translate-y-3">
          <div class="absolute top-6 right-10 text-6xl font-black text-gray-200/40 group-hover:text-secondary/10 transition-colors">02</div>
          <div class="relative z-10">
            <div class="relative w-20 h-20 mb-10 group-hover:scale-110 transition-transform duration-500">
              <div class="absolute inset-0 bg-secondary/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all"></div>
              <div class="relative w-full h-full bg-secondary text-white rounded-[1.8rem] flex items-center justify-center shadow-lg transform rotate-3 group-hover:-rotate-6 transition-all duration-500">
                <i class="fas fa-briefcase text-4xl"></i>
              </div>
            </div>
            <h3 class="text-2xl font-black mb-4 text-secondary tracking-tight group-hover:text-secondary transition-colors">Business</h3>
            <p class="text-gray-500 leading-relaxed text-lg font-medium">Connecting entrepreneurs to create a high-performance network of global success and innovation.</p>
            <div class="mt-8 flex items-center text-secondary font-black text-[11px] tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0 transition-all">
              Expand Network <i class="fas fa-arrow-right ml-3"></i>
            </div>
          </div>
        </div>

        <!-- Pillar 3: Community -->
        <div class="group relative card-reveal p-10 rounded-[3rem] bg-gray-50 border border-gray-100 overflow-hidden transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.07)] hover:-translate-y-3">
          <div class="absolute top-6 right-10 text-6xl font-black text-gray-200/40 group-hover:text-primary/10 transition-colors">03</div>
          <div class="relative z-10">
            <div class="relative w-20 h-20 mb-10 group-hover:scale-110 transition-transform duration-500">
              <div class="absolute inset-0 bg-primary/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all"></div>
              <div class="relative w-full h-full bg-primary text-white rounded-[1.8rem] flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-6 transition-all duration-500">
                <i class="fas fa-globe-americas text-4xl"></i>
              </div>
            </div>
            <h3 class="text-2xl font-black mb-4 text-secondary tracking-tight group-hover:text-primary transition-colors">Community</h3>
            <p class="text-gray-500 leading-relaxed text-lg font-medium">Building stronger, more resilient communities through sustainable and impactful local action.</p>
            <div class="mt-8 flex items-center text-primary font-black text-[11px] tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0 transition-all">
              Take Action <i class="fas fa-arrow-right ml-3"></i>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- PAST PRESIDENTS AND OFFICE BEARERS -->
    <section id="legacy" class="py-12 sm:py-20 bg-[#fdfdfd] px-4 sm:px-6 relative overflow-hidden section-reveal">
      <div class="max-w-[1600px] mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-10 sm:mb-16 reveal-up">
          <p class="text-[#b8860b] font-black tracking-[0.4em] sm:tracking-[0.8em] uppercase text-[9px] sm:text-[11px] mb-4 sm:mb-6">Our Gratitude to</p>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a202c] tracking-tighter leading-none mb-6 sm:mb-10">Past Presidents & <span class="text-[#b8860b]">Office Bearers</span></h2>
          <div class="w-32 sm:w-40 h-1 bg-gradient-to-r from-transparent via-[#b8860b] to-transparent mx-auto"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          
          <!-- Card 1: Past Presidents -->
          <div class="group relative bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(184,134,11,0.1)] hover:shadow-[0_30px_60px_-12px_rgba(184,134,11,0.2)] transition-all duration-700 hover:-translate-y-2 card-reveal border border-gray-100 flex flex-col md:flex-row overflow-hidden">
            <div class="absolute top-0 left-0 w-1.5 h-full bg-[#b8860b]"></div>
            
            <div class="w-full md:w-[30%] h-48 md:h-auto relative overflow-hidden bg-[#faf7f2] flex items-center justify-center p-2">
              <img src="assets/image/past_presidents_new (2).png" alt="Past Presidents" class="relative z-10 w-full h-full object-contain transition-transform duration-700 scale-125 group-hover:scale-[1.35]">
            </div>

            <div class="w-full md:w-[70%] p-6 sm:p-8 flex flex-col">
              <div class="flex items-center space-x-3 mb-3">
                <span class="px-3 py-1 rounded-full bg-[#b8860b]/10 text-[#b8860b] font-black text-[9px] tracking-widest uppercase">Legacy Since 1981</span>
                <div class="h-px flex-1 bg-gray-100"></div>
              </div>
              <h3 class="text-2xl font-black text-[#1a202c] mb-2 uppercase tracking-tighter group-hover:text-[#b8860b] transition-colors">Past <span class="text-[#b8860b]">Presidents</span></h3>
              <p class="text-[#4a5568] text-sm leading-relaxed mb-6 font-medium">A special thank you to <span class="font-bold text-[#1a202c]">JC. S. A. P. Angam Sir</span> and all visionary leaders who shaped our chapter's excellence.</p>
              <div class="mt-auto">
                <a routerLink="/about" class="inline-flex items-center space-x-2 text-[#1a202c] font-black text-[10px] tracking-widest uppercase group/btn">
                  <span>View Legacy</span>
                  <i class="fas fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- Card 2: Office Bearers -->
          <div class="group relative bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(15,76,117,0.1)] hover:shadow-[0_30px_60px_-12px_rgba(15,76,117,0.2)] transition-all duration-700 hover:-translate-y-2 card-reveal border border-gray-100 flex flex-col md:flex-row overflow-hidden">
            <div class="absolute top-0 left-0 w-1.5 h-full bg-[#0f4c75]"></div>

            <div class="w-full md:w-[30%] h-48 md:h-auto relative overflow-hidden bg-[#f5f7fa] flex items-center justify-center p-2">
              <img src="assets/image/office_bearers_new (1).png" alt="Office Bearers" class="relative z-10 w-full h-full object-contain transition-transform duration-700 scale-125 group-hover:scale-[1.35]">
            </div>

            <div class="w-full md:w-[70%] p-6 sm:p-8 flex flex-col">
              <div class="flex items-center space-x-3 mb-3">
                <span class="px-3 py-1 rounded-full bg-[#0f4c75]/10 text-[#0f4c75] font-black text-[9px] tracking-widest uppercase">Active Leadership</span>
                <div class="h-px flex-1 bg-gray-100"></div>
              </div>
              <h3 class="text-2xl font-black text-[#1a202c] mb-2 uppercase tracking-tighter group-hover:text-[#0f4c75] transition-colors">Office <span class="text-[#0f4c75]">Bearers</span></h3>
              <p class="text-[#4a5568] text-sm leading-relaxed mb-6 font-medium">Heartfelt gratitude to our dedicated team of office bearers for their tireless efforts in driving our mission forward.</p>
              <div class="mt-auto">
                <a routerLink="/about" class="inline-flex items-center space-x-2 text-[#1a202c] font-black text-[10px] tracking-widest uppercase group/btn">
                  <span>Meet the Team</span>
                  <i class="fas fa-users text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ENQUIRY SECTION -->
    <section class="py-12 sm:py-20 bg-white overflow-hidden section-reveal" id="enquiry">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-24 items-center">
        <div class="reveal-left">
          <div class="relative rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden shadow-2xl border-[8px] sm:border-[15px] border-white group h-[400px] sm:h-[500px] lg:h-[600px]">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" class="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000">
            <div class="absolute inset-0 bg-secondary/60"></div>
            <div class="absolute bottom-8 sm:bottom-16 left-8 sm:left-16 right-8 sm:right-16 text-white">
              <h3 class="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 leading-tight">Your Leadership <br>Journey Starts Here</h3>
              <p class="font-bold text-sm sm:text-lg opacity-80">Join the world's leading network of young active citizens.</p>
            </div>
          </div>
        </div>
        <div class="reveal-right">
          <div class="bg-gray-50 p-8 sm:p-12 md:p-16 rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl border border-gray-100">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-secondary mb-8 sm:mb-12 text-center tracking-tighter">Get In <span class="text-primary">Touch</span></h2>
            <form (ngSubmit)="submitEnquiry()" class="space-y-4 sm:space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <input type="text" [(ngModel)]="enquiryData.name" name="name" required class="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-white border-none outline-none focus:ring-4 focus:ring-primary/20 shadow-sm text-base sm:text-lg font-medium" placeholder="Name">
                <input type="text" [(ngModel)]="enquiryData.location" name="location" required class="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-white border-none outline-none focus:ring-4 focus:ring-primary/20 shadow-sm text-base sm:text-lg font-medium" placeholder="Location">
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <input type="email" [(ngModel)]="enquiryData.email" name="email" required class="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-white border-none outline-none focus:ring-4 focus:ring-primary/20 shadow-sm text-base sm:text-lg font-medium" placeholder="Email">
                <input type="tel" [(ngModel)]="enquiryData.phone" name="phone" required class="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-white border-none outline-none focus:ring-4 focus:ring-primary/20 shadow-sm text-base sm:text-lg font-medium" placeholder="Phone">
              </div>
              <textarea [(ngModel)]="enquiryData.message" name="message" rows="4" required class="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-white border-none outline-none focus:ring-4 focus:ring-primary/20 shadow-sm text-base sm:text-lg font-medium" placeholder="Your Message"></textarea>
              <button type="submit" [disabled]="isSubmitting" class="w-full bg-secondary text-white py-4 sm:py-6 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-xl hover:bg-primary transition-all shadow-xl active:scale-95 group">
                <span *ngIf="!isSubmitting">Send Message <i class="fas fa-paper-plane ml-3 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform"></i></span>
                <i *ngIf="isSubmitting" class="fas fa-spinner fa-spin"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .glow-text { text-shadow: 0 0 20px rgba(0, 198, 167, 0.5); }
    .neon-glow { filter: drop-shadow(0 0 15px rgba(0, 198, 167, 0.4)); }
    .glass-search-box { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 198, 167, 0.3); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 198, 167, 0.5); }

    .stat-glass-card {
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
    }
    .stat-glass-card:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-10px) scale(1.05);
      border-color: rgba(0, 198, 167, 0.4);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .gradient-text { background: linear-gradient(to right, #00c6a7, #0f4c75); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .gradient-text-v2 { background: linear-gradient(to bottom right, #ffffff, #00c6a7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    
    .bg-grid-pattern {
      background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: grid-move 20s linear infinite;
    }

    @keyframes grid-move {
      from { background-position: 0 0; }
      to { background-position: 50px 50px; }
    }

    @keyframes slow-spin {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    .animate-slow-spin { animation: slow-spin 30s linear infinite; }

    @keyframes blob-v3 {
      0% { transform: translate(0, 0) scale(1) rotate(0deg); }
      33% { transform: translate(10%, -15%) scale(1.1) rotate(120deg); }
      66% { transform: translate(-15%, 10%) scale(0.9) rotate(240deg); }
      100% { transform: translate(0, 0) scale(1) rotate(360deg); }
    }
    .animate-blob-v3 { animation: blob-v3 20s infinite linear; }

    .shard {
      position: absolute;
      background: linear-gradient(45deg, rgba(255,255,255,0.1), transparent);
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255,255,255,0.1);
      animation: shard-float 15s infinite ease-in-out;
      will-change: transform;
    }

    @keyframes shard-float {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
      50% { transform: translateY(-100px) rotate(180deg); opacity: 0.6; }
    }

    .shard-1 { width: 100px; height: 100px; top: 20%; left: 15%; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); animation-delay: 0s; }
    .shard-2 { width: 150px; height: 150px; top: 60%; left: 80%; clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%); animation-delay: 2s; }
    .shard-3 { width: 80px; height: 80px; top: 10%; right: 20%; clip-path: circle(50% at 50% 50%); animation-delay: 4s; }
    .shard-4 { width: 120px; height: 120px; bottom: 15%; left: 40%; clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); animation-delay: 6s; }

    .hero-mesh {
      background-color: #0f4c75;
      background-image: 
        radial-gradient(at 0% 0%, hsla(170,94%,43%,0.35) 0, transparent 60%), 
        radial-gradient(at 100% 0%, hsla(170,94%,43%,0.35) 0, transparent 60%),
        radial-gradient(at 50% 50%, hsla(202,77%,26%,0.5) 0, transparent 80%);
    }

    .perspective-container { perspective: 2000px; }
    .rotate-y-6 { transform: rotateY(6deg); }
  `]
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  activities = [
    { text: 'Tree Plantation: Greening our community through massive sapling drives and environmental awareness.', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop' },
    { text: 'Empowering Education: Supporting underprivileged children with books, study materials and tutoring.', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop' },
    { text: 'Leadership Workshops: Developing future leaders through intensive training and mentorship programs.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop' },
    { text: 'Community Welfare: Actively participating in local growth and humanitarian aid projects.', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop' }
  ];

  heroImages = [
    'https://www.shutterstock.com/image-photo/diverse-group-people-sit-circle-600nw-2752627881.jpg',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=3840&q=100',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=3840&q=100'
  ];
  currentImageIndex = 0;
  private sliderSubscription?: Subscription;

  displayTeam = [
    { name: 'JFP. HGF. S. GOWTHAM', role: 'President', image: 'https://www.jcislmmidtown.com/assets/images/team/team-1.jpg' },
    { name: 'Jc. HGF. K. PRABHU', role: 'Secretary', image: 'https://www.jcislmmidtown.com/assets/images/team/team-2.jpg' },
    { name: 'Jc. HGF. R. RAJKUMAR', role: 'Member', image: 'https://www.jcislmmidtown.com/assets/images/team/team-3.jpg' }
  ];

  teamMembers: TeamMember[] = [];
  enquiryData = { name: '', email: '', phone: '', location: '', message: '' };
  isSubmitting = false;

  // Search Properties
  searchQuery: string = '';
  allEvents: Event[] = [];
  filteredEvents: Event[] = [];
  private mouseMoveHandler?: (e: MouseEvent) => void;

  // State for lazy loading
  showInstagram = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private eventService: EventService, 
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() { 
    this.loadTeam(); 
    this.loadEvents();
    
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        // Automatic Image Slider Logic - Outside zone to prevent blocking hydration
        this.sliderSubscription = interval(5000).subscribe(() => {
          this.ngZone.run(() => {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.heroImages.length;
            this.cdr.markForCheck();
          });
        });

        // Lazy load Instagram after a delay
        setTimeout(() => {
          this.ngZone.run(() => {
            this.showInstagram = true;
            this.cdr.markForCheck();
          });
        }, 2000);
      });
    }
  }

  loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.allEvents = events;
        this.filteredEvents = events;
        this.cdr.markForCheck();
      }
    });
  }

  loadTeam() {
    this.eventService.getMembers().subscribe({
      next: (members) => { this.teamMembers = members; this.cdr.markForCheck(); }
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredEvents = this.allEvents;
      this.cdr.markForCheck();
      return;
    }
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredEvents = this.allEvents.filter(event => 
      event.title.toLowerCase().includes(query) || 
      event.description.toLowerCase().includes(query) ||
      event.type.toLowerCase().includes(query)
    );
    this.cdr.markForCheck();
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredEvents = this.allEvents;
    this.cdr.markForCheck();
  }

  scrollToEvents() {
    const el = document.getElementById('events-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToEvent(eventId: any) {
    this.searchQuery = '';
    this.filteredEvents = this.allEvents;
    alert(`Showing details for: ${this.allEvents.find(e => e._id === eventId)?.title}`);
  }

  scrollToEnquiry() {
    const el = document.getElementById('enquiry');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  submitEnquiry() {
    if (!this.enquiryData.name || !this.enquiryData.email || !this.enquiryData.phone) { alert('Please fill in all required fields'); return; }
    this.isSubmitting = true;
    this.cdr.markForCheck();
    this.eventService.addEnquiry(this.enquiryData).subscribe({
      next: () => { alert('Enquiry sent successfully!'); this.enquiryData = { name: '', email: '', phone: '', location: '', message: '' }; this.isSubmitting = false; this.cdr.markForCheck(); },
      error: () => { alert('Error sending enquiry.'); this.isSubmitting = false; this.cdr.markForCheck(); }
    });
  }

  ngOnDestroy() {
    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.animateHero();
        
        // Ensure reveal only targets existing classes
        ScrollReveal.reveal('.reveal-left', 'left');
        ScrollReveal.reveal('.reveal-right', 'right');
        ScrollReveal.reveal('.section-reveal', 'up');
        
        const cards = document.querySelectorAll('.card-reveal');
        cards.forEach((card, index) => { 
          ScrollReveal.reveal(card as any, 'up', index * 0.15); 
        });
      });
    }
  }

  animateHero() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const tl = gsap.timeline();
    
    tl.to('.hero-slide-up', { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' })
      .to('.hero-title-line', { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'expo.out' }, '-=0.3')
      .to('.hero-fade-in', { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power4.out' }, '-=0.5');

    // MOUSE PARALLAX EFFECT - Run outside Angular to avoid stability issues
    this.mouseMoveHandler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      
      gsap.to('.parallax-shards', {
        x: x * 0.5,
        y: y * 0.5,
        duration: 1,
        ease: 'power2.out'
      });

      gsap.to('.hero-mesh', {
        backgroundPosition: `${x * 0.2}% ${y * 0.2}%`,
        duration: 1.5,
        ease: 'power1.out'
      });
    };
    window.addEventListener('mousemove', this.mouseMoveHandler);
  }
}
