import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export class ScrollReveal {
  static reveal(selector: string | HTMLElement, direction: 'up' | 'down' | 'left' | 'right' = 'up', delay: number = 0) {
    if (typeof window === 'undefined') return;

    const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
    if (!elements || (elements instanceof NodeList && elements.length === 0)) return;

    gsap.registerPlugin(ScrollTrigger);

    const targetElements = elements instanceof NodeList ? Array.from(elements) : [elements];

    targetElements.forEach(el => {
      const yValue = direction === 'up' ? 50 : direction === 'down' ? -50 : 0;
      const xValue = direction === 'left' ? 50 : direction === 'right' ? -50 : 0;

      gsap.from(el, {
        scrollTrigger: {
          trigger: el as any,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: yValue,
        x: xValue,
        duration: 0.6,
        delay: delay,
        ease: 'power2.out'
      });
    });
  }

  static revealLines(selector: string, delay: number = 0.1) {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el as any,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: index * delay,
        ease: 'power2.out'
      });
    });
  }
}
