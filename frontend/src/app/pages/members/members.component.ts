import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EventService, TeamMember } from '../../services/event.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#020617] pt-24 md:pt-32 pb-24 px-4 overflow-x-hidden selection:bg-blue-600/30 text-slate-200">
      
      <!-- ABSTRACT BACKGROUND -->
      <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-20%] right-[-10%] w-[70%] md:w-[50%] h-[50%] bg-blue-600/10 blur-[100px] md:blur-[150px] rounded-full animate-float-slow"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-cyan-600/10 blur-[80px] md:blur-[120px] rounded-full animate-float-delayed"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGMtMS4xIDAtMi0uOS0yLTJzLjktMiAyLTIgMiAuOSAyIDIgLS45IDItMiAyeiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div class="max-w-[1400px] mx-auto relative z-10">
        
        <!-- HEADER SECTION -->
        <div class="text-center mb-20 md:mb-32 header-reveal">
          <div class="inline-flex items-center space-x-3 px-4 md:px-5 py-2 bg-slate-800/50 backdrop-blur-xl rounded-full border border-slate-700/50 mb-6 md:mb-8 shadow-2xl">
            <span class="relative flex h-2 w-2 md:h-3 md:w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-cyan-500"></span>
            </span>
            <span class="text-[8px] md:text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Command Center</span>
          </div>
          <h1 class="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-tight drop-shadow-2xl">
            Meet the <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Leadership</span>
          </h1>
          <p class="text-slate-400 max-w-2xl mx-auto text-base md:text-xl font-medium leading-relaxed px-4">
            The visionary architects dedicated to driving excellence and impactful change within our global network.
          </p>
        </div>

        <!-- ORG CHART WRAPPER -->
        <div class="org-chart-wrapper overflow-x-auto pb-32 scrollbar-hide">
          <div class="tree-container min-w-[1000px] lg:min-w-full lg:px-10">
            
            <!-- LEVEL 1: ADVISOR -->
            <div class="tree-row mb-20 md:mb-24 tree-node-lvl-1 relative z-30">
              <div class="tree-node">
                <ng-container *ngTemplateOutlet="memberCard; context: { $implicit: getOneByRole('Advisor'), role: 'Strategic Advisor', color: 'from-blue-600 to-indigo-600', ringColor: 'ring-blue-500' }"></ng-container>
                <div class="v-line h-16 md:h-24 bg-gradient-to-b from-blue-500 to-slate-700 relative overflow-hidden">
                  <div class="absolute top-0 left-0 w-full h-1/3 bg-white/50 blur-[2px] animate-flow-down"></div>
                </div>
              </div>
            </div>

            <!-- LEVEL 2: CHAIRMAN & EVENT MANAGER -->
            <div class="tree-row mb-20 md:mb-24 relative tree-node-lvl-2 z-20">
              <div class="h-line absolute top-0 left-[25%] right-[25%] border-t-2 border-slate-700 relative overflow-hidden">
                 <div class="absolute top-[-1px] left-1/2 w-1/4 h-[4px] bg-cyan-400/50 blur-[2px] animate-flow-horizontal"></div>
              </div>
              <div class="flex justify-center gap-[10%] md:gap-[15%] pt-10 md:pt-12">
                <div class="tree-node relative">
                  <div class="v-line absolute -top-10 md:-top-12 left-1/2 h-10 md:h-12 bg-slate-700"></div>
                  <ng-container *ngTemplateOutlet="memberCard; context: { $implicit: getOneByRole('Chairman'), role: 'Chairman', color: 'from-cyan-500 to-blue-500', ringColor: 'ring-cyan-400' }"></ng-container>
                </div>
                <div class="tree-node relative">
                  <div class="v-line absolute -top-10 md:-top-12 left-1/2 h-10 md:h-12 bg-slate-700"></div>
                  <ng-container *ngTemplateOutlet="memberCard; context: { $implicit: getOneByRole('Event Manager'), role: 'Event Manager', color: 'from-cyan-500 to-blue-500', ringColor: 'ring-cyan-400' }"></ng-container>
                  <div class="v-line h-16 md:h-24 bg-gradient-to-b from-slate-700 to-slate-800 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1/3 bg-white/20 blur-[2px] animate-flow-down" style="animation-delay: 1s"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- LEVEL 3: DEPARTMENTS -->
            <div class="tree-row relative tree-node-lvl-3 z-10">
              <div class="h-line absolute top-0 left-[8%] right-[8%] border-t-2 border-slate-800"></div>
              <div class="grid grid-cols-5 gap-4 md:gap-8 pt-10 md:pt-12 px-4 w-full">
                <div *ngFor="let role of ['Finance', 'Sponsorship', 'Marketing & Promotion', 'Logistic', 'Food & Beverage']" class="tree-node relative">
                  <div class="v-line absolute -top-10 md:-top-12 left-1/2 h-10 md:h-12 bg-slate-800"></div>
                  <ng-container *ngTemplateOutlet="memberCard; context: { $implicit: getOneByRole(role), role: role, color: 'from-slate-700 to-slate-900', ringColor: 'ring-slate-500', small: true }"></ng-container>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- GENERAL MEMBERS -->
        <div class="mt-20 md:mt-32 pt-20 md:pt-32 border-t border-slate-800/60 members-grid-reveal relative">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          
          <div class="text-center mb-16 md:mb-24 px-4">
            <h3 class="text-3xl md:text-5xl font-black text-white tracking-tight">Dedicated <span class="text-cyan-400">Officers</span></h3>
            <p class="text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-[10px] mt-4 italic">The operational force of Salem Midtown</p>
          </div>
          
          <div *ngIf="teamMembers.length > 0; else empty" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16 px-4">
            <div *ngFor="let m of getGeneralMembers(); let i = index" class="officer-card group relative flex flex-col items-center">
              
              <!-- Hexagon Image Wrapper -->
              <div class="relative w-24 h-28 md:w-28 md:h-32 mx-auto mb-4 md:mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 z-10">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 opacity-20 blur-xl group-hover:opacity-60 transition-opacity duration-500"></div>
                <div class="w-full h-full" style="clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
                   <div class="w-full h-full p-0.5 md:p-1 bg-gradient-to-br from-slate-700 to-slate-900">
                     <div class="w-full h-full bg-slate-900" style="clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
                        <img [src]="m.image" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity filter grayscale-[50%] group-hover:grayscale-0">
                     </div>
                   </div>
                </div>
              </div>

              <!-- Name & Role -->
              <div class="text-center relative z-20 bg-slate-900/80 backdrop-blur-sm px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl border border-slate-800 shadow-xl group-hover:border-cyan-900/50 transition-colors w-full sm:w-[120%] -mt-8 md:-mt-10">
                <h5 class="text-[10px] md:text-xs font-black text-white uppercase tracking-tight line-clamp-1">{{ m.name }}</h5>
                <p class="text-[7px] md:text-[8px] text-cyan-400 font-black uppercase tracking-widest mt-1 opacity-80 group-hover:opacity-100">{{ m.role }}</p>
              </div>
              
              <!-- Connecting Line to Hexagon -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 w-px h-1/2 bg-slate-800 -z-10 group-hover:bg-cyan-900/50 transition-colors hidden sm:block"></div>
            </div>
          </div>
        </div>

        <ng-template #empty>
          <div class="py-20 text-center text-slate-500 italic font-medium">
            Awaiting transmission of officer data...
          </div>
        </ng-template>

      </div>
    </div>

    <!-- ADVANCED 3D MEMBER CARD TEMPLATE -->
    <ng-template #memberCard let-member let-role="role" let-color="color" let-ringColor="ringColor" let-small="small">
      <div class="group relative flex flex-col items-center member-node-card perspective-[1000px]">
        
        <!-- 3D Card Container -->
        <div [class.w-[280px]]="!small" [class.md:w-[320px]]="!small" 
             [class.w-[180px]]="small" [class.md:w-[240px]]="small"
             class="card-3d relative bg-slate-900/80 backdrop-blur-2xl p-0.5 md:p-1 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 z-10 border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-[0_0_80px_rgba(34,211,238,0.15)]">
          
          <!-- Inner Content -->
          <div class="h-full w-full bg-gradient-to-b from-slate-800/50 to-slate-900/80 rounded-[1.9rem] md:rounded-[2.3rem] p-4 md:p-8 relative overflow-hidden flex flex-col items-center">
            
            <!-- Grid Background Overlay -->
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xOSAxOUgxVjFoMTh2MTh6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-50"></div>
            
            <!-- Top Gradient Highlight -->
            <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r" [ngClass]="color"></div>

            <!-- Role Badge -->
            <div class="absolute top-3 md:top-4 left-1/2 -translate-x-1/2 px-3 md:px-4 py-1 rounded-full bg-slate-950/80 border border-slate-700/50 backdrop-blur-md shadow-lg z-20">
              <span class="text-[6px] md:text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap group-hover:text-white transition-colors">{{ role }}</span>
            </div>

            <!-- Holographic Profile Image -->
            <div class="relative w-20 h-20 md:w-36 md:h-36 mx-auto mt-6 md:mt-8 mb-4 md:mb-6 perspective-500 z-10">
              <!-- Outer Rotating Rings -->
              <div class="absolute -inset-2 md:-inset-4 rounded-full border border-slate-700 animate-spin-slow opacity-50 group-hover:border-cyan-500/30 transition-colors"></div>
              <div class="absolute -inset-1 md:-inset-2 rounded-full border-t-2 border-l-2 border-transparent animate-spin-reverse-slow" [ngClass]="ringColor"></div>
              
              <!-- Image Container -->
              <div class="w-full h-full rounded-full p-1 md:p-1.5 bg-gradient-to-b from-slate-700 to-slate-900 shadow-2xl shadow-black/50 relative overflow-hidden group-hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-shadow">
                <div class="w-full h-full rounded-full overflow-hidden border border-slate-800 bg-slate-950 relative">
                  <img [src]="member?.image || 'https://randomuser.me/api/portraits/lego/' + (small ? '4' : '1') + '.jpg'" 
                       class="w-full h-full object-cover filter contrast-125 saturate-110 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110">
                  <div class="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
                </div>
              </div>
            </div>

            <!-- Details -->
            <div class="text-center relative z-10 w-full px-2">
              <h5 class="text-sm md:text-xl font-black text-white uppercase tracking-tighter leading-tight mb-2 md:mb-3 group-hover:text-cyan-300 transition-colors line-clamp-1">
                {{ member ? member.name : 'Unassigned' }}
              </h5>
              
              <div class="w-full flex items-center justify-center space-x-2 md:space-x-3">
                <div class="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700"></div>
                <div class="flex items-center space-x-1.5 md:space-x-2 px-2 md:px-3 py-0.5 md:py-1 bg-slate-950/50 rounded-full border border-slate-800/50">
                  <span class="relative flex h-1 w-1 md:h-1.5 md:w-1.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" [class]="member ? 'bg-emerald-400' : 'bg-rose-500'"></span>
                    <span class="relative inline-flex rounded-full h-1 w-1 md:h-1.5 md:w-1.5" [class]="member ? 'bg-emerald-500' : 'bg-rose-600'"></span>
                  </span>
                  <span class="text-[6px] md:text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">{{ member ? 'Online' : 'Offline' }}</span>
                </div>
                <div class="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700"></div>
              </div>
            </div>
            
          </div>
        </div>
        
        <!-- Bottom Reflection / Ambient Glow -->
        <div class="absolute -bottom-6 md:-bottom-8 w-2/3 h-6 md:h-8 bg-cyan-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10"></div>
      </div>
    </ng-template>
  `,
  styles: [`
    .tree-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .tree-row { display: flex; justify-content: center; width: 100%; }
    .tree-node { display: flex; flex-direction: column; align-items: center; }
    .v-line { width: 2px; z-index: 0; }
    .h-line { height: 2px; z-index: 0; }

    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes float-slow {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-20px, 40px) scale(1.05); }
    }
    .animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
    
    @keyframes float-delayed {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(40px, -30px) scale(0.95); }
    }
    .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }

    @keyframes flow-down {
      0% { transform: translateY(-100%); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateY(300%); opacity: 0; }
    }
    .animate-flow-down { animation: flow-down 3s infinite linear; }

    @keyframes flow-horizontal {
      0% { transform: translateX(-200%); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateX(200%); opacity: 0; }
    }
    .animate-flow-horizontal { animation: flow-horizontal 4s infinite linear; }

    .animate-spin-slow { animation: spin 15s linear infinite; }
    .animate-spin-reverse-slow { animation: spin 10s linear infinite reverse; }
    
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .perspective-500 { perspective: 500px; }
    
    .card-3d {
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease;
    }
    
    @media (min-width: 1024px) {
      .group:hover .card-3d {
        transform: translateY(-10px) rotateX(5deg) rotateY(-2deg);
      }
    }

    @media (max-width: 1024px) {
      .org-chart-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    }
  `]
})
export class MembersComponent implements OnInit, AfterViewInit {
  teamMembers: TeamMember[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private eventService: EventService, 
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadMembers();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        gsap.registerPlugin(ScrollTrigger);
        this.initAnimations();
      });
    }
  }

  initAnimations() {
    gsap.from('.header-reveal', {
      y: 50,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out'
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.tree-container',
        start: 'top 80%',
      }
    });

    tl.from('.tree-node-lvl-1', { y: 50, opacity: 0, duration: 1, ease: 'back.out(1.5)' })
      .from('.tree-node-lvl-2', { y: 50, opacity: 0, duration: 1, ease: 'back.out(1.2)' }, '-=0.6')
      .from('.tree-node-lvl-3', { y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'back.out(1.2)' }, '-=0.6');

    const officerCards = document.querySelectorAll('.officer-card');
    if (officerCards.length > 0) {
      gsap.from('.officer-card', {
        scrollTrigger: {
          trigger: '.members-grid-reveal',
          start: 'top 85%',
        },
        scale: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: 'back.out(1.5)'
      });
    }
  }

  loadMembers() {
    this.eventService.getMembers().subscribe({
      next: (members) => {
        this.teamMembers = members;
        this.cdr.markForCheck();
      }
    });
  }

  getOneByRole(role: string): TeamMember | undefined {
    return this.teamMembers.find(m => m.role.toLowerCase().includes(role.toLowerCase()));
  }

  getGeneralMembers(): TeamMember[] {
    const hierarchyRoles = ['Advisor', 'Chairman', 'Event Manager', 'Finance', 'Sponsorship', 'Marketing', 'Logistic', 'Food'];
    return this.teamMembers.filter(m => !hierarchyRoles.some(r => m.role.toLowerCase().includes(r.toLowerCase())));
  }
}
