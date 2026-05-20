import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { eventService } from '../../services/api';
import aboutImg from '../../assets/image/ChatGPT Image Apr 21, 2026, 02_19_37 PM.png';
import pastPresidentsImg from '../../assets/image/past_presidents_new (2).png';
import officeBearersImg from '../../assets/image/office_bearers_new (1).png';

// Register ScrollTrigger once
gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [enquiryData, setEnquiryData] = useState({ name: '', email: '', phone: '', location: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const activities = [
    { text: 'Leadership Conference: Empowering young leaders to create lasting impact through networking and collaboration.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop' },
    { text: 'Empowering Education: Supporting underprivileged children with books, study materials and tutoring.', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop' },
    { text: 'Leadership Workshops: Developing future leaders through intensive training and mentorship programs.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop' },
    { text: 'Community Welfare: Actively participating in local growth and humanitarian aid projects.', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop' }
  ];

  const heroImages = [
    'https://www.shutterstock.com/image-photo/diverse-group-people-sit-circle-600nw-2752627881.jpg',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=3840&q=100',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=3840&q=100'
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo('.hero-slide-up', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' })
        .fromTo('.hero-title-line', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'expo.out' }, '-=0.4')
        .fromTo('.hero-fade-in', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power4.out' }, '-=0.6');

      const sections = gsap.utils.toArray('.section-reveal') as HTMLElement[];
      sections.forEach((el) => {
        gsap.fromTo(el, 
          { y: 50, opacity: 0 },
          { 
            y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      const cards = gsap.utils.toArray('.card-reveal') as HTMLElement[];
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
            scrollTrigger: {
              trigger: cards[0],
              start: "top 95%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    }, mainRef);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      gsap.to('.parallax-shards', { x: x * 0.5, y: y * 0.5, duration: 1, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => {
      ctx.revert();
      clearInterval(intervalId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToEnquiry = () => {
    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryData.name || !enquiryData.email || !enquiryData.phone || !enquiryData.message) {
      alert('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await eventService.addEnquiry(enquiryData);
      alert('Enquiry sent successfully!');
      setEnquiryData({ name: '', email: '', phone: '', message: '' });
    } catch (error: any) {
      console.error('Enquiry Error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Error sending enquiry.';
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="home-container overflow-hidden" ref={mainRef}>
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-24 md:pt-28 overflow-hidden text-center">
        <div className="absolute inset-0 z-[-1]">
          {heroImages.map((img, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentImageIndex === index ? 'opacity-100' : 'opacity-0'}`}>
              <img src={img} className="w-full h-full object-cover scale-105" alt="" {...(index === 0 ? { fetchPriority: "high" } : { loading: "lazy" })} decoding="async" />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
            </div>
          ))}
          <div className="parallax-shards absolute inset-0">
            {[1,2,3,4].map(i => <div key={i} className={`shard shard-${i} hidden sm:block`}></div>)}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 w-full pb-20">
          <div className="hero-content-wrapper">
            <div className="inline-block px-6 py-2 mb-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-3xl hero-slide-up">
               <span className="text-primary font-black tracking-[0.4em] uppercase text-[10px]">JCI Salem Midtown • Excellence Redefined</span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-8 text-white leading-tight tracking-tighter uppercase">
              <span className="block hero-title-line">Empowering</span>
              <span className="block hero-title-line gradient-text-v2 neon-glow">Global Leaders</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 hero-fade-in font-medium">Developing leadership and entrepreneurship to create <span className="text-white font-bold border-b-4 border-primary/50">positive global change.</span></p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 hero-fade-in">
              <div className="p-2 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 flex flex-col sm:flex-row gap-4">
                <button onClick={scrollToEnquiry} className="btn-primary">Join Movement</button>
                <Link to="/about" className="group px-10 py-5 rounded-[2.5rem] bg-white/10 hover:bg-white text-white hover:text-secondary transition-all font-bold backdrop-blur-md flex items-center gap-3 border border-white/20">Our Story</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] translate-y-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] sm:h-[100px] fill-[#fcfcfc]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.47,110.19,121,124.09,188.85,124.09,252.33,124.09,285,110.19,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about-section" className="py-32 px-6 max-w-[1600px] mx-auto relative section-reveal bg-[#fcfcfc]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-xs font-black text-primary tracking-[0.5em] uppercase mb-6 flex items-center">
              <span className="w-8 h-[1px] bg-primary mr-4"></span> JCI Salem Midtown
            </h2>
            <h3 className="text-5xl md:text-7xl font-black text-secondary mb-8 leading-tight tracking-tighter">Leadership <br /><span className="gradient-text">Since 1981</span></h3>
            <p className="text-gray-500 text-xl mb-12 leading-relaxed font-medium">Dedicated to empowering young leaders, fostering community development, and driving positive change.</p>
            <div className="space-y-6">
              <div className="flex items-center space-x-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl"><i className="fas fa-bolt"></i></div>
                <div><p className="font-black text-secondary text-lg">Impactful Programs</p></div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white h-[60vh] sm:h-[80vh] group">
              <img src={aboutImg} className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110" alt="" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITIES SECTION */}
      <section id="activities-section" className="py-32 bg-[#f8fafc] px-6 section-reveal">
        <div className="max-w-[1600px] mx-auto text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter uppercase">Impactful <span className="gradient-text">Initiatives</span></h2>
            <div className="w-24 h-1.5 bg-primary mx-auto mt-8 rounded-full"></div>
        </div>
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {activities.map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 group card-reveal">
              <div className="relative w-32 h-32 flex-shrink-0 rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white transition-all group-hover:scale-110">
                <img src={item.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" loading="lazy" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-secondary font-black text-2xl mb-3 group-hover:text-primary transition-colors">{item.text.split(':')[0]}</h4>
                <p className="text-gray-400 font-medium text-base">{item.text.split(':')[1] || item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS SECTION */}
      <section id="pillars-section" className="py-32 bg-white relative overflow-hidden section-reveal">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] text-[15rem] sm:text-[25rem] font-black pointer-events-none select-none whitespace-nowrap tracking-tighter z-0 uppercase text-secondary">FOUNDATION</div>
        <div className="max-w-[1600px] mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl sm:text-7xl font-black text-secondary tracking-tighter relative inline-block">Our Core <span className="gradient-text">Pillars</span>
              <div className="absolute -bottom-4 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full transform origin-left animate-width-reveal"></div>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {['Leadership', 'Business', 'Community'].map((title, i) => (
              <div key={i} className="group relative p-12 rounded-[3.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 overflow-hidden card-reveal">
                <div className="absolute top-8 right-10 text-8xl font-black text-secondary/5 group-hover:text-primary/10 transition-colors">0{i+1}</div>
                <div className="relative z-10 w-20 h-20 mb-12 bg-white text-primary rounded-[1.8rem] flex items-center justify-center shadow-xl border border-gray-50 transform -rotate-3 group-hover:rotate-6 transition-all duration-500">
                  <i className={`fas fa-${i === 0 ? 'graduation-cap' : i === 1 ? 'briefcase' : 'globe-americas'} text-4xl`}></i>
                </div>
                <h3 className="text-3xl font-black mb-4 text-secondary group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-gray-500 text-lg font-medium leading-relaxed">Dedicated to fostering growth and excellence in our global network.</p>
                <div className="mt-8 flex items-center text-primary font-black text-[11px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500">Learn Impact <ArrowRight className="ml-3 w-4 h-4" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEGACY SECTION */}
      <section id="legacy" className="py-24 bg-[#f8fafc] px-6 section-reveal">
        <div className="max-w-[1600px] mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#1a202c] tracking-tighter uppercase">Leadership <span className="text-[#b8860b]">Legacy</span></h2>
          <div className="w-20 h-1.5 bg-[#b8860b] mx-auto mt-6 rounded-full"></div>
        </div>
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="group relative bg-white rounded-[3rem] shadow-sm hover:shadow-xl transition-all flex flex-col sm:flex-row overflow-hidden h-auto sm:h-[220px] card-reveal border border-slate-100">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#b8860b]"></div>
            <div className="w-full sm:w-[35%] h-40 sm:h-full bg-[#faf7f2] flex items-center justify-center p-6 overflow-hidden"><img src={pastPresidentsImg} className="w-full h-full object-contain group-hover:scale-110 transition-all duration-700" alt="" loading="lazy" /></div>
            <div className="w-full sm:w-[65%] p-10 flex flex-col justify-center bg-white">
              <h3 className="text-2xl font-black text-[#1a202c] mb-2 uppercase group-hover:text-[#b8860b] transition-colors">Past <span className="text-[#b8860b]">Presidents</span></h3>
              <Link to="/legacy" className="text-[10px] font-black uppercase tracking-[0.3em] mt-6 flex items-center gap-3">Explore Legacy <ArrowRight className="w-3 h-3 text-[#b8860b]" /></Link>
            </div>
          </div>
          <div className="group relative bg-white rounded-[3rem] shadow-sm hover:shadow-xl transition-all flex flex-col sm:flex-row overflow-hidden h-auto sm:h-[220px] card-reveal border border-slate-100">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0f4c75]"></div>
            <div className="w-full sm:w-[35%] h-40 sm:h-full bg-[#f5f7fa] flex items-center justify-center p-6"><img src={officeBearersImg} className="w-full h-full object-contain group-hover:scale-110 transition-all duration-700" alt="" loading="lazy" /></div>
            <div className="w-full sm:w-[65%] p-10 flex flex-col justify-center bg-white">
              <h3 className="text-2xl font-black text-[#1a202c] mb-2 uppercase group-hover:text-[#0f4c75] transition-colors">Office <span className="text-[#0f4c75]">Bearers</span></h3>
              <Link to="/members" className="text-[10px] font-black uppercase tracking-[0.3em] mt-6 flex items-center gap-3">Meet Leaders <ArrowRight className="w-3 h-3 text-secondary" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ENQUIRY SECTION */}
      <section id="enquiry" className="py-32 bg-white section-reveal px-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="rounded-[4rem] overflow-hidden shadow-2xl h-[600px] border-[12px] border-white group">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt="" loading="lazy" />
          </div>
          <div className="bg-slate-50 p-16 rounded-[4rem] shadow-xl border border-white flex flex-col justify-center text-center">
             <h2 className="text-5xl font-black text-secondary mb-12 tracking-tighter uppercase">Get In <span className="text-primary">Touch</span></h2>
             <form onSubmit={handleEnquirySubmit} className="space-y-8">
                <input type="text" placeholder="Name" required className="w-full p-6 rounded-3xl bg-white shadow-sm border border-slate-100 outline-none focus:ring-4 focus:ring-primary/10 transition-all" value={enquiryData.name} onChange={e => setEnquiryData({...enquiryData, name: e.target.value})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input type="email" placeholder="Email" required className="w-full p-6 rounded-3xl bg-white shadow-sm border border-slate-100 outline-none focus:ring-4 focus:ring-primary/10 transition-all" value={enquiryData.email} onChange={e => setEnquiryData({...enquiryData, email: e.target.value})} />
                  <input type="tel" placeholder="Phone Number" required className="w-full p-6 rounded-3xl bg-white shadow-sm border border-slate-100 outline-none focus:ring-4 focus:ring-primary/10 transition-all" value={enquiryData.phone} onChange={e => setEnquiryData({...enquiryData, phone: e.target.value})} />
                </div>
                <textarea placeholder="Message" rows={4} className="w-full p-6 rounded-3xl bg-white shadow-sm border border-slate-100 outline-none focus:ring-4 focus:ring-primary/10 transition-all" value={enquiryData.message} onChange={e => setEnquiryData({...enquiryData, message: e.target.value})}></textarea>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-lg uppercase tracking-widest">{isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <>Send Message <ArrowRight className="w-5 h-5" /></>}</button>
             </form>
          </div>
        </div>
      </section>

      <style>{`
        .gradient-text { background: linear-gradient(to right, #00c6a7, #0f4c75); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .gradient-text-v2 { background: linear-gradient(to bottom right, #ffffff, #00c6a7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .shard { position: absolute; background: rgba(255,255,255,0.1); backdrop-filter: blur(5px); animation: float 15s infinite ease-in-out; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-100px); } }
        .shard-1 { width: 100px; height: 100px; top: 20%; left: 15%; }
        .shard-2 { width: 150px; height: 150px; top: 60%; left: 80%; }
        .animate-width-reveal { animation: width-reveal 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        @keyframes width-reveal { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>
    </div>
  );
};

export default Home;
