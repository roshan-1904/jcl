import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventService } from '../../services/api';
import type { Event } from '../../services/api';
import { MapPin, Clock, ArrowRight, X, Sparkles } from 'lucide-react';

// Register ScrollTrigger once
gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    eventService.getEvents()
      .then((res) => { if (res.data) setEvents(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));

    let ctx = gsap.context(() => {
      gsap.fromTo('.event-header-reveal', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: 'expo.out', stagger: 0.2 }
      );
    }, mainRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!loading && events.length > 0) {
      let ctx = gsap.context(() => {
        gsap.fromTo('.event-card-premium', 
          { y: 60, opacity: 0, scale: 0.9 },
          { 
            y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.1, ease: 'back.out(1.4)',
            scrollTrigger: { trigger: '.event-grid-premium', start: 'top 85%' }
          }
        );
      }, mainRef);
      return () => ctx.revert();
    }
  }, [loading, events]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-40 pb-32 px-4" ref={mainRef}>
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <div className="event-header-reveal inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8">
            <Sparkles className="w-3 h-3" /> Future Milestones
          </div>
          <h1 className="event-header-reveal text-6xl md:text-8xl font-black text-secondary tracking-tighter mb-8 leading-[0.9]">
            Live <span className="gradient-text">Experiences</span>
          </h1>
          <p className="event-header-reveal text-gray-400 text-xl font-medium">Witness the evolution of leadership through our transformative events.</p>
        </div>

        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="event-grid-premium grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event) => (
              <div key={event._id} className="event-card-premium group relative bg-white rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-4 overflow-hidden">
                <div className="relative h-80 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-2xl border border-white/50">{event.type}</div>
                </div>
                <div className="p-10">
                   <div className="flex items-center gap-4 mb-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /> {event.location}</div>
                      <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-primary" /> {event.time}</div>
                   </div>
                   <h3 className="text-3xl font-black text-secondary mb-6 group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">{event.title}</h3>
                   <p className="text-gray-400 text-base line-clamp-3 mb-10 leading-relaxed">{event.description}</p>
                   <button onClick={() => setSelectedEvent(event)} className="text-secondary font-black text-xs uppercase tracking-[0.3em] flex items-center group/btn">
                      Explore <ArrowRight className="ml-3 w-4 h-4 text-primary transform group-hover/btn:translate-x-2 transition-transform" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center opacity-30 uppercase font-black tracking-widest text-sm">Chronicles Empty</div>
        )}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-secondary/95 backdrop-blur-2xl">
          <div className="bg-white w-full max-w-6xl rounded-[4rem] overflow-hidden shadow-2xl relative">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-10 right-10 w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center z-50 transition-all hover:scale-110 shadow-2xl"><X className="w-6 h-6" /></button>
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
              <div className="h-[40vh] lg:h-full relative overflow-hidden bg-slate-100">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover scale-105" />
                <div className="absolute bottom-12 left-12"><h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase">{selectedEvent.title}</h2></div>
              </div>
              <div className="p-10 lg:p-20 flex flex-col justify-center bg-white">
                <p className="text-gray-500 leading-relaxed text-xl font-medium mb-12">{selectedEvent.description}</p>
                <button className="btn-primary w-full py-6 text-xl">Secure Your Presence</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gradient-text { background: linear-gradient(to right, #00c6a7, #0f4c75); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>
    </div>
  );
};

export default Events;
