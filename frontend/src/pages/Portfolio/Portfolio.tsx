import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Portfolio: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{id: number, url: string, title: string, category: string} | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const images = Array.from({ length: 34 }, (_, i) => ({
    id: i + 1,
    url: `/src/assets/image1/${i + 1}.jpg`,
    title: `Business Project ${i + 1}`,
    category: i % 3 === 0 ? 'Leadership' : i % 3 === 1 ? 'Business' : 'Community'
  }));

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo('.reveal-up', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' });
      
      const cards = gsap.utils.toArray('.card-reveal') as HTMLElement[];
      gsap.fromTo(cards, 
        { y: 50, opacity: 0, scale: 0.95 },
        { 
          y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.05, ease: 'power2.out',
          scrollTrigger: { trigger: '.gallery-grid', start: 'top 85%' }
        }
      );
    }, mainRef);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to('.hero-mesh-portfolio', { backgroundPosition: `${x * 0.1}% ${y * 0.1}%`, duration: 1.5, ease: 'power1.out' });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfc] overflow-hidden" ref={mainRef}>
      <section className="relative pt-40 pb-20 px-6 z-10 hero-mesh-portfolio bg-[#0f4c75] text-white text-center">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-block px-6 py-2 mb-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl reveal-up">
            <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px]">Business • Innovation • Excellence</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter reveal-up uppercase">Our <span className="gradient-text-v2">Portfolio</span></h1>
          <p className="text-white/70 text-xl max-w-3xl mx-auto mb-12 reveal-up font-medium">Exploring our diverse range of transformative projects.</p>
          <div className="w-32 h-1.5 bg-primary mx-auto rounded-full reveal-up"></div>
        </div>
      </section>

      <section className="py-24 px-6 relative z-10">
        <div className="max-w-[1600px] mx-auto gallery-grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {images.map((img) => (
              <div key={img.id} onClick={() => setSelectedImage(img)} className="group relative card-reveal rounded-[2rem] overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-2 border border-slate-100 cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 text-white">
                    <span className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary text-[8px] font-black uppercase tracking-widest border border-primary/30">{img.category}</span>
                    <h3 className="text-xl font-black mt-4 uppercase">{img.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl w-full h-[80vh] bg-white rounded-[3rem] overflow-hidden flex flex-col md:row" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center z-50 shadow-2xl"><X /></button>
            <div className="w-full h-full flex flex-col md:flex-row">
               <div className="w-full md:w-2/3 bg-slate-100 h-[50vh] md:h-full"><img src={selectedImage.url} className="w-full h-full object-contain" alt="" /></div>
               <div className="w-full md:w-1/3 p-12 flex flex-col justify-center">
                  <h2 className="text-4xl font-black text-secondary mb-6 uppercase tracking-tighter leading-none">{selectedImage.title}</h2>
                  <p className="text-gray-500 text-lg leading-relaxed mb-10">Celebrating excellence through strategic initiatives and leadership.</p>
                  <button className="btn-primary w-full py-5">View Details</button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hero-mesh-portfolio { background-image: radial-gradient(at 0% 0%, hsla(170,94%,43%,0.2) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(170,94%,43%,0.2) 0, transparent 50%); }
        .gradient-text-v2 { background: linear-gradient(to bottom right, #ffffff, #00c6a7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>
    </div>
  );
};

export default Portfolio;
