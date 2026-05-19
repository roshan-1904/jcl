import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const ScrollOverlay = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const lenisRef = useRef<Lenis | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressInnerRef = useRef<HTMLDivElement>(null);
  const trackerIconRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    let lenis: Lenis | null = null;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });
      lenisRef.current = lenis;

      const updateTicker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(updateTicker);
      lenis.on('scroll', ScrollTrigger.update);

      const onScroll = (e: any) => {
        const scrolled = e.scroll;
        const windowHeight = window.innerHeight;
        const fullHeight = document.documentElement.scrollHeight;
        
        const totalScrollable = fullHeight - windowHeight;
        const percentage = totalScrollable > 0 ? (scrolled / totalScrollable) * 100 : 0;
        
        if (progressInnerRef.current) progressInnerRef.current.style.height = `${percentage}%`;
        if (trackerIconRef.current) trackerIconRef.current.style.top = `${percentage}%`;

        const hero = document.querySelector('.hero-content-wrapper') as HTMLElement;
        if (hero) hero.style.transform = `translateY(${scrolled * 0.2}px)`;
      };
      lenis.on('scroll', onScroll);

      return () => {
        lenis?.destroy();
        gsap.ticker.remove(updateTicker);
      };
    } catch (e) {
      console.error("Lenis Init Error:", e);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
  };

  if (isAdminPage) return null;

  return (
    <>
      <div 
        ref={progressBarRef}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] h-80 w-8 flex flex-col items-center group hidden md:flex cursor-pointer"
        onMouseDown={startDragging}
        onTouchStart={startDragging}
      >
        <div className="absolute inset-y-0 bg-secondary/10 rounded-full w-0.5 mx-auto pointer-events-none">
          <div ref={progressInnerRef} className="w-full bg-primary rounded-full transition-all duration-75" style={{ height: '0%' }}></div>
        </div>
        
        <div className="absolute inset-y-0 w-full flex flex-col justify-between items-center py-2 pointer-events-none">
          {['Home', 'About', 'Activities', 'Pillars', 'Enquiry'].map((id) => (
            <div key={id} className="relative group/dot flex items-center justify-center pointer-events-auto cursor-pointer" onClick={() => {
                const target = id === 'Home' ? 0 : document.getElementById(id.toLowerCase() + '-section');
                lenisRef.current?.scrollTo(target || 0);
            }}>
              <div className="w-1.5 h-1.5 rounded-full border border-primary/30 bg-white transition-all group-hover/dot:scale-150 group-hover/dot:bg-primary"></div>
            </div>
          ))}
        </div>

        <div ref={trackerIconRef} className="absolute w-8 h-8 bg-white shadow-xl rounded-full border-2 border-primary flex items-center justify-center pointer-events-none" style={{ top: '0%' }}>
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
          <i className="fas fa-location-arrow text-[10px] text-primary rotate-[130deg]"></i>
        </div>
      </div>
    </>
  );
};

export default ScrollOverlay;
