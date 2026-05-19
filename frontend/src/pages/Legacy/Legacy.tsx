import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventService, LegacyImage } from '../../services/api';
import pastPresidentsImg from '../../assets/image/past_presidents_new (2).png';

gsap.registerPlugin(ScrollTrigger);

const Legacy = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<LegacyImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getLegacyImages()
      .then(res => {
        setImages(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching legacy images:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading) return;
    
    let ctx = gsap.context(() => {
      gsap.fromTo('.reveal-up', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power3.out" });
      
      gsap.fromTo('.reveal-left', 
        { x: -100, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: '.reveal-left', start: 'top 85%' } }
      );
      
      gsap.fromTo('.reveal-right', 
        { x: 100, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: '.reveal-right', start: 'top 85%' } }
      );
    }, mainRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <div className="min-h-screen bg-[#0a192f] text-slate-300 overflow-hidden" ref={mainRef}>
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full animate-pulse"></div>
      </div>

      <section className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center mb-24">
            <div className="inline-block px-6 py-2 mb-8 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl reveal-up">
              <span className="text-blue-400 font-black tracking-[0.4em] uppercase text-[10px]">Visual History • Our Legacy in Frames</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-none reveal-up">The <span className="gradient-text-v2">Gallery</span></h1>
            <div className="w-24 h-1.5 bg-blue-500 mx-auto rounded-full reveal-up"></div>
        </div>

        {loading ? (
          <div className="py-20 text-center uppercase tracking-widest font-black text-blue-500/40 animate-pulse">Gathering Memories...</div>
        ) : (
          <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
              {images.map((img, i) => (
                <div key={img._id || i} className="break-inside-avoid reveal-up group">
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900 shadow-2xl transition-all duration-700 hover:-translate-y-2">
                    <img src={img.image} alt={img.title} className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                      <p className="text-white font-black text-[10px] tracking-[0.3em] uppercase">{img.title || 'Chapter Memory'}</p>
                    </div>
                  </div>
                </div>
              ))}
              {images.length === 0 && (
                <div className="col-span-full py-40 text-center">
                  <p className="text-blue-500/40 uppercase font-black tracking-[0.5em]">No gallery items found in record.</p>
                </div>
              )}
          </div>
        )}
      </section>

      <section className="relative py-40 px-6 z-10 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="reveal-left">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter uppercase leading-[0.9]">Foundation of <br /><span className="text-blue-500">Service</span></h2>
              <p className="text-slate-400 text-xl mb-12 leading-relaxed font-medium italic pr-10">"Building a sustainable future through 45 years of visionary leadership and dedication."</p>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-all">
                  <h3 className="text-4xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">1981</h3>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Year Established</p>
                </div>
                <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-all">
                  <h3 className="text-4xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">45+</h3>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active Years</p>
                </div>
              </div>
            </div>
            <div className="reveal-right">
              <div className="relative rounded-[4rem] overflow-hidden border-[15px] border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] group">
                <img src={pastPresidentsImg} className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105" alt="Legacy" />
              </div>
            </div>
        </div>
      </section>

      <section className="relative py-40 px-6 z-10 text-center">
        <div className="absolute inset-0 bg-blue-600/[0.03] -skew-y-3 transform origin-right"></div>
        <div className="max-w-4xl mx-auto relative">
          <h2 className="text-5xl md:text-8xl font-black text-white mb-12 tracking-tighter uppercase reveal-up">Join the <br /><span className="text-blue-500">Movement</span></h2>
          <button className="btn-primary px-16 py-6 text-xl shadow-[0_20px_50px_rgba(0,198,167,0.3)] reveal-up">Secure Your Legacy</button>
        </div>
      </section>

      <style>{`
        .gradient-text-v2 { background: linear-gradient(to bottom right, #ffffff, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>
    </div>
  );
};

export default Legacy;
