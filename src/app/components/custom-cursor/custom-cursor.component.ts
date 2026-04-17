import { Component, AfterViewInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cursor-dot fixed w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] opacity-0"></div>
    <div class="cursor-outline fixed w-8 h-8 border-2 border-primary/40 rounded-full pointer-events-none z-[9998] opacity-0"></div>
  `,
  styles: [`
    :host { pointer-events: none; }
  `]
})
export class CustomCursorComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const dot = document.querySelector('.cursor-dot');
      const outline = document.querySelector('.cursor-outline');

      gsap.set([dot, outline], { xPercent: -50, yPercent: -50, opacity: 1 });

      window.addEventListener('mousemove', (e) => {
        gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(outline, { x: e.clientX, y: e.clientY, duration: 0.3, ease: 'power2.out' });
      });

      // Hover Effects for links/buttons
      const targets = document.querySelectorAll('a, button, .group');
      targets.forEach(target => {
        target.addEventListener('mouseenter', () => {
          gsap.to(outline, { scale: 1.8, backgroundColor: 'rgba(0, 198, 167, 0.1)', duration: 0.3 });
          gsap.to(dot, { scale: 0.5, duration: 0.3 });
        });
        target.addEventListener('mouseleave', () => {
          gsap.to(outline, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
          gsap.to(dot, { scale: 1, duration: 0.3 });
        });
      });
    }
  }
}
