import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollReveal } from '../../utils/scroll-reveal';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-page-wrapper overflow-hidden bg-[#f5f7fa]">
      <!-- DECORATIVE BACKGROUND ELEMENTS -->
      <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full animate-pulse-slow animation-delay-2000"></div>
        <div class="parallax-shards absolute inset-0">
          <div class="shard shard-1"></div>
          <div class="shard shard-2"></div>
          <div class="shard shard-3"></div>
        </div>
      </div>

      <!-- SECTION 1: HERO INTRO -->
      <section class="relative pt-40 pb-24 px-6 z-10 hero-mesh-about">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <!-- Left: Image -->
            <div class="reveal-left relative group">
              <div class="relative rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] z-10 border-[12px] border-white">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                     alt="JCI Leadership" 
                     class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              <!-- Decorative elements behind image -->
              <div class="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-float"></div>
              <div class="absolute -bottom-10 -right-10 w-60 h-60 bg-secondary/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
            </div>

            <!-- Right: Content -->
            <div class="reveal-right">
              <div class="inline-block px-6 py-2 mb-8 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
                <span class="text-primary font-black tracking-[0.3em] uppercase text-[10px]">Excellence • Leadership • Impact</span>
              </div>
              <h1 class="text-5xl md:text-7xl font-black text-secondary mb-8 leading-[0.9] tracking-tighter">About <br><span class="gradient-text">JCI Salem Midtown</span></h1>
              <p class="text-gray-500 text-xl mb-10 leading-relaxed font-medium">
                A premium legacy of leadership development. We empower individuals aged 18 to 40 to create positive change in the heart of Salem.
              </p>
              <div class="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 mb-12 transform hover:-translate-y-2 transition-all duration-500">
                <div class="flex items-center space-x-4 mb-4">
                  <div class="w-12 h-1 bg-primary rounded-full"></div>
                  <h4 class="text-2xl font-black text-secondary uppercase tracking-tighter">Our Mission</h4>
                </div>
                <p class="text-gray-500 text-lg italic">"To provide leadership development opportunities that empower young people to create positive change."</p>
              </div>
              <button class="group relative px-14 py-6 overflow-hidden rounded-2xl bg-secondary font-black text-white transition-all hover:shadow-[0_20px_40px_rgba(15,76,117,0.3)] active:scale-95">
                <span class="relative z-10 text-lg">Join Our Chapter</span>
                <div class="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 2: WHAT IS JCI (4 CARDS) -->
      <section class="relative py-32 px-6 z-10 overflow-hidden">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-24 reveal-up">
            <h2 class="text-xs font-black text-primary tracking-[0.5em] uppercase mb-6">Core Opportunities</h2>
            <h3 class="text-5xl md:text-6xl font-black text-secondary tracking-tighter">What is <span class="gradient-text">JCI?</span></h3>
            <div class="w-32 h-2.5 bg-gradient-main mx-auto mt-10 rounded-full shadow-lg"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            @for (area of opportunities; track area.title; let i = $index) {
              <div class="card-reveal group relative p-10 rounded-[3rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-4">
                <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]"></div>
                <div class="w-20 h-20 rounded-3xl bg-gray-50 text-primary flex items-center justify-center mb-10 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-12">
                  <i class="fas {{ area.icon }} text-3xl"></i>
                </div>
                <h3 class="text-2xl font-black text-secondary mb-6 tracking-tight">{{ area.title }}</h3>
                <p class="text-gray-400 font-medium leading-relaxed">{{ area.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- SECTION 3: KEY ACTIVITIES -->
      <section class="relative py-32 bg-white/40 backdrop-blur-sm px-6 z-10">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-24 reveal-up">
            <h2 class="text-5xl md:text-7xl font-black text-secondary mb-6 tracking-tighter">Our Activities & <br><span class="gradient-text">Impactful Initiatives</span></h2>
            <div class="w-24 h-2 bg-primary mx-auto rounded-full"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
            <div class="reveal-left">
              <ul class="space-y-12">
                @for (item of activities.slice(0, 2); track item.text) {
                  <li class="flex items-start space-x-8 group">
                    <div class="w-28 h-28 flex-shrink-0 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                      <img [src]="item.image" [alt]="item.text" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
                    </div>
                    <div class="flex-1 pt-4">
                       <div class="flex items-center space-x-3 mb-3">
                         <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                           <i class="fas fa-check text-[10px]"></i>
                         </div>
                         <span class="text-primary font-black text-[10px] uppercase tracking-widest">Active Project</span>
                       </div>
                       <p class="text-gray-600 font-bold text-lg leading-relaxed group-hover:text-secondary transition-colors">{{ item.text }}</p>
                    </div>
                  </li>
                }
              </ul>
            </div>

            <div class="reveal-right">
              <ul class="space-y-12">
                @for (item of activities.slice(2); track item.text) {
                  <li class="flex items-start space-x-8 group">
                    <div class="w-28 h-28 flex-shrink-0 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                      <img [src]="item.image" [alt]="item.text" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
                    </div>
                    <div class="flex-1 pt-4">
                       <div class="flex items-center space-x-3 mb-3">
                         <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                           <i class="fas fa-check text-[10px]"></i>
                         </div>
                         <span class="text-primary font-black text-[10px] uppercase tracking-widest">Active Project</span>
                       </div>
                       <p class="text-gray-600 font-bold text-lg leading-relaxed group-hover:text-secondary transition-colors">{{ item.text }}</p>
                    </div>
                  </li>
                }
              </ul>
            </div>
          </div>

        </div>
      </section>

      <!-- SECTION 4: PRESIDENTS OF MIDTOWN (Sky Blue & Professional Theme) -->
      <section class="relative py-32 px-6 bg-slate-50 overflow-hidden">
        <!-- Background Decoration -->
        <div class="absolute inset-0 z-0">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.05)_0%,_transparent_70%)]"></div>
          <div class="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGMtMS4xIDAtMi0uOS0yLTJzLjktMiAyLTIgMiAuOSAyIDIgLS45IDItMiAyeiIgZmlsbD0iIzBlYTVlOSIgZmlsbC1vcGFjaXR5PSIxIi8+PC9zdmc+')]"></div>
        </div>

        <div class="max-w-7xl mx-auto relative z-10">
          <!-- Section Divider -->
          <div class="flex items-center justify-center mb-24 reveal-up">
            <div class="h-px w-24 bg-gradient-to-r from-transparent to-primary"></div>
            <div class="mx-6 w-3 h-3 rotate-45 border border-primary"></div>
            <h2 class="text-4xl md:text-6xl font-black text-secondary tracking-tighter text-center mx-4">
              Presidents of <span class="gradient-text">Midtown</span>
            </h2>
            <div class="mx-6 w-3 h-3 rotate-45 border border-primary"></div>
            <div class="h-px w-24 bg-gradient-to-l from-transparent to-primary"></div>
          </div>

          <!-- Responsive Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            @for (p of presidents; track p.name; let i = $index) {
              <div class="group relative p-10 rounded-[3.5rem] bg-white border border-slate-100 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(14,165,233,0.12)] card-reveal overflow-hidden">
                
                <!-- Decorative background blob -->
                <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>

                <!-- Profile Image Container -->
                <div class="relative w-48 h-48 mx-auto mb-8 z-10">
                  <!-- Premium outer glow -->
                  <div class="absolute -inset-4 rounded-[3.5rem] bg-primary/5 group-hover:bg-primary/10 blur-2xl transition-all duration-700"></div>
                  
                  <!-- Main Image Holder -->
                  <div class="w-full h-full rounded-[3rem] p-1 bg-gradient-to-tr from-primary via-sky-300 to-secondary shadow-[0_20px_50px_rgba(14,165,233,0.3)] overflow-hidden transform group-hover:scale-105 transition-transform duration-700">
                    <div class="w-full h-full rounded-[2.8rem] overflow-hidden border-[6px] border-white bg-white">
                      <img [src]="'https://i.pravatar.cc/400?u=' + p.name" 
                           [alt]="p.name" 
                           class="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110">
                    </div>
                  </div>

                  <!-- Year Badge overlay -->
                  <div class="absolute -bottom-2 -right-2 bg-secondary text-white px-4 py-1.5 rounded-2xl text-[10px] font-black tracking-widest shadow-xl border-2 border-white z-20 group-hover:bg-primary transition-colors">
                    {{ p.year }}
                  </div>
                </div>

                <!-- Content -->
                <div class="text-center relative z-10">
                  <h3 class="text-2xl font-black text-secondary mb-4 tracking-tight group-hover:text-primary transition-colors duration-500">{{ p.name }}</h3>
                  
                  <div class="flex justify-center items-center space-x-2 mb-6">
                    <div class="h-px w-8 bg-slate-200"></div>
                    <div class="w-2 h-2 rounded-full bg-primary/20"></div>
                    <div class="h-px w-8 bg-slate-200"></div>
                  </div>
                  
                  <!-- Status Badges -->
                  @if (p.status === 'Deceased') {
                    <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-red-50/80 border border-red-100 text-red-500 text-[9px] font-black uppercase tracking-widest shadow-sm">
                      <span class="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                      Deceased
                    </span>
                  } @else if (p.status === 'Left') {
                    <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                      Left
                    </span>
                  } @else {
                    <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                      Active Member
                    </span>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- SECTION 5: GLOBAL NETWORK (COUNTERS) -->
      <section class="relative py-40 px-6 overflow-hidden z-10">
        <div class="absolute inset-0 bg-[#0f4c75] -z-10">
          <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div class="absolute inset-0 bg-gradient-to-br from-secondary via-transparent to-primary/20"></div>
        </div>
        
        <div class="max-w-7xl mx-auto text-center text-white relative z-10">
          <h2 class="text-xs font-black text-primary tracking-[0.5em] uppercase mb-8 reveal-up">Global Footprint</h2>
          <h3 class="text-5xl md:text-7xl font-black mb-10 tracking-tighter reveal-up">A World of <span class="gradient-text-v2">Impact</span></h3>
          <p class="text-white/60 max-w-3xl mx-auto text-xl mb-24 reveal-up leading-relaxed font-medium">
            JCI is a global network of over 200,000 young leaders across 100+ countries, building international bridges and creating sustainable change.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div class="reveal-up p-12 glass !bg-white/5 border-white/10 rounded-[3.5rem] group hover:bg-white/10 transition-all duration-500">
              <h3 class="text-6xl font-black mb-4 counter text-primary glow-text" data-target="200000">0</h3>
              <p class="text-white/40 font-black uppercase tracking-[0.3em] text-xs">Active Members</p>
            </div>
            <div class="reveal-up p-12 glass !bg-white/5 border-white/10 rounded-[3.5rem] group hover:bg-white/10 transition-all duration-500">
              <h3 class="text-6xl font-black mb-4 counter text-primary glow-text" data-target="100">0</h3>
              <p class="text-white/40 font-black uppercase tracking-[0.3em] text-xs">Countries</p>
            </div>
            <div class="reveal-up p-12 glass !bg-white/5 border-white/10 rounded-[3.5rem] group hover:bg-white/10 transition-all duration-500">
              <h3 class="text-6xl font-black mb-4 counter text-primary glow-text" data-target="5000">0</h3>
              <p class="text-white/40 font-black uppercase tracking-[0.3em] text-xs">Local Chapters</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .gradient-text { background: linear-gradient(to right, #00c6a7, #0f4c75); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .gradient-text-v2 { background: linear-gradient(to bottom right, #ffffff, #00c6a7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .glow-text { text-shadow: 0 0 30px rgba(0, 198, 167, 0.5); }
    
    .hero-mesh-about {
      background-image: 
        radial-gradient(at 0% 0%, hsla(170,94%,43%,0.15) 0, transparent 50%), 
        radial-gradient(at 100% 0%, hsla(170,94%,43%,0.15) 0, transparent 50%);
    }

    .bg-grid-pattern {
      background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    .shard {
      position: absolute;
      background: linear-gradient(45deg, rgba(255,255,255,0.1), transparent);
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255,255,255,0.1);
      animation: shard-float 20s infinite ease-in-out;
    }

    @keyframes shard-float {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
      50% { transform: translateY(-100px) rotate(180deg); opacity: 0.4; }
    }

    .shard-1 { width: 150px; height: 150px; top: 15%; left: 5%; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
    .shard-2 { width: 200px; height: 200px; top: 60%; right: 5%; clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%); animation-delay: -5s; }
    .shard-3 { width: 100px; height: 100px; bottom: 10%; left: 10%; clip-path: circle(50% at 50% 50%); animation-delay: -10s; }

    @keyframes pulse-slow {
      0%, 100% { transform: scale(1); opacity: 0.1; }
      50% { transform: scale(1.2); opacity: 0.2; }
    }
    .animate-pulse-slow { animation: pulse-slow 10s infinite ease-in-out; }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-30px); }
    }
    .animate-float { animation: float 8s infinite ease-in-out; }
    .animation-delay-2000 { animation-delay: 2s; }
  `]
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  private mouseMoveHandler?: (e: MouseEvent) => void;

  presidents = [
    { name: "Jc. Ashok", year: "2026" },
    { name: "Jc. Satyanarayanan", year: "2024" },
    { name: "Jc. Suresh Kumar", year: "2023" },
    { name: "Jc. Karunamirdhan", year: "2022" },
    { name: "Jc. Munivel", year: "2021" },
    { name: "Jc. Karthick", year: "2020" },
    { name: "Jc. Mohanraj", year: "2019" },
    { name: "Jc. Vinoth", year: "2018" },
    { name: "Jc. Sabarinathan", year: "2017" },
    { name: "Jc. Babu Rangarajan", year: "2016" },
    { name: "Jc. Rojesh", year: "2015" },
    { name: "Jc. Narayanan", year: "2014" },
    { name: "Jc. Jhothikrishna", year: "2013" },
    { name: "Jc. Dhamodharan", year: "2012" },
    { name: "Jc. Prakadhmohan", year: "2011" },
    { name: "Jc. Mohanasundram", year: "2010" },
    { name: "Jc. Venkateshbabu", year: "2009" },
    { name: "Jc. Bhuvaneshwari Kishore", year: "2008" },
    { name: "Jc. Anandharaman", year: "2007" },
    { name: "Jc. Rangachari", year: "2006" },
    { name: "Jc. Badrinarayanan", year: "2005" },
    { name: "Jc. Sivakumar", year: "2004", status: "Deceased" },
    { name: "Jc. Viswanathan", year: "2003" },
    { name: "Jc. Umapathi", year: "2002" },
    { name: "Jc. Singh", year: "2001", status: "Deceased" },
    { name: "Jc. Radhakrishnan", year: "2000" },
    { name: "Jc. Kishore Kumar", year: "1999" },
    { name: "Jc. Veeramani", year: "1998", status: "Deceased" },
    { name: "Jc. Ramesh Babu", year: "1997", status: "Left" },
    { name: "Jc. Kanna", year: "1996", status: "Left" },
    { name: "Jc. Vijayakumar", year: "1995" },
    { name: "Jc. Rangasamy", year: "1994" },
    { name: "Jc. Kannan", year: "1993" },
    { name: "Jc. Ravivarma", year: "1992" },
    { name: "Jc. Seralathan", year: "1991" },
    { name: "Jc. Ramamoorthy", year: "1990" },
    { name: "Jc. Eswaran", year: "1989" },
    { name: "Jc. Raja", year: "1988", status: "Deceased" },
    { name: "Jc. Ethiraj", year: "1987" },
    { name: "Jc. Thulasidas", year: "1986" },
    { name: "Jc. Murugan", year: "1985" },
    { name: "Jc. Palanisamy", year: "1984", status: "Deceased" },
    { name: "Jc. Rajukinger", year: "1983", status: "Deceased" },
    { name: "Jc. Angannan", year: "1981-82", status: "Deceased" }
  ];

  opportunities = [
    { icon: 'fa-user-tie', title: 'Individual Development', desc: 'Improve leadership, communication, and personality skills through intensive training.' },
    { icon: 'fa-hands-helping', title: 'Community Development', desc: 'Solve real-world problems through impactful local projects and sustainable initiatives.' },
    { icon: 'fa-briefcase', title: 'Business Networking', desc: 'Connect with young entrepreneurs and professionals for mutual growth and expansion.' },
    { icon: 'fa-globe', title: 'International Opportunities', desc: 'Join a massive global network across 100+ countries and build international ties.' }
  ];

  activities = [
    { 
      text: 'Community Projects: Engaging in impactful local service and social welfare.',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop'
    },
    { 
      text: 'Professional Growth: Workshops and events focused on leadership skills.',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop'
    },
    { 
      text: 'Landmark Projects: Proudly maintaining the JCI Clock Tower in Salem.',
      image: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?q=80&w=2042&auto=format&fit=crop'
    },
    { 
      text: 'Major Conventions: Organizing key regional events like MIDCON 2026.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
      this.initCounters();
    }
  }

  ngOnDestroy() {
    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
    }
  }

  initAnimations() {
    ScrollReveal.reveal('.reveal-up', 'up');
    ScrollReveal.reveal('.reveal-left', 'left');
    ScrollReveal.reveal('.reveal-right', 'right');
    
    const cards = document.querySelectorAll('.card-reveal');
    cards.forEach((card, index) => {
      ScrollReveal.reveal(card as HTMLElement, 'up', index * 0.05);
    });

    // MOUSE PARALLAX EFFECT
    this.mouseMoveHandler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      
      gsap.to('.parallax-shards', {
        x: x * 0.8,
        y: y * 0.8,
        duration: 1.5,
        ease: 'power2.out'
      });

      gsap.to('.hero-mesh-about', {
        backgroundPosition: `${x * 0.1}% ${y * 0.1}%`,
        duration: 2,
        ease: 'power1.out'
      });
    };
    window.addEventListener('mousemove', this.mouseMoveHandler);
  }

  initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target')!;
      const count = { val: 0 };
      
      gsap.to(count, {
        val: target,
        duration: 3,
        scrollTrigger: {
          trigger: counter,
          start: 'top 90%',
        },
        onUpdate: () => {
          counter.innerHTML = Math.floor(count.val).toLocaleString() + (target === 100 ? '+' : '+');
        }
      });
    });
  }
}
