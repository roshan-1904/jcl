import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventService, President, TeamMember, AboutContent } from '../../services/api';

// Register ScrollTrigger once
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [presidents, setPresidents] = useState<President[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    title: 'About JCI MidTown',
    subtitle: 'Leadership Since 1981',
    description: 'Dedicated to empowering young leaders, fostering community development, and driving positive change.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop'
  });
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [presRes, teamRes, aboutRes] = await Promise.all([
          eventService.getPresidents(),
          eventService.getMembers(),
          eventService.getAboutContent()
        ]);
        
        setPresidents(presRes.data.sort((a, b) => parseInt(b.year) - parseInt(a.year)));
        setTeamMembers(teamRes.data);
        if (aboutRes.data) {
           setAboutContent({
             ...aboutRes.data,
             image: aboutRes.data.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop'
           });
        }
      } catch (err) {
        console.error("Error loading about page data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    let ctx = gsap.context(() => {
      gsap.fromTo('.reveal-up', 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: '.reveal-up', start: "top 90%" } }
      );
      
      const counters = document.querySelectorAll('.counter');
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target')!;
        const count = { val: 0 };
        gsap.to(count, {
          val: target, duration: 3,
          scrollTrigger: { trigger: counter, start: 'top 90%' },
          onUpdate: () => { counter.innerHTML = Math.floor(count.val).toLocaleString() + '+'; }
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => { ScrollTrigger.refresh(); }, [isLoading, presidents, teamMembers]);

  return (
    <div className="about-page-wrapper overflow-hidden bg-[#fcfcfc]" ref={mainRef}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full"></div>
      </div>

      <section className="relative pt-40 pb-24 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white">
                <img src={aboutContent.image} className="w-full h-full object-cover" alt="JCI" />
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-7xl font-black text-secondary mb-8 tracking-tighter uppercase leading-none">
                {aboutContent.title.split(' ')[0]} <br />
                <span className="gradient-text">{aboutContent.title.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-gray-500 text-xl mb-10 font-medium italic">{aboutContent.subtitle}</p>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">{aboutContent.description}</p>
              <button className="btn-primary px-12 py-5">Join Our Chapter</button>
            </div>
        </div>
      </section>

      <section className="py-32 px-6 relative z-10 bg-white shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { icon: 'fa-user-tie', title: 'Individual Development', desc: 'Improve leadership, communication, and personality skills through intensive training.' },
            { icon: 'fa-hands-helping', title: 'Community Development', desc: 'Solve real-world problems through impactful local projects.' },
            { icon: 'fa-briefcase', title: 'Business Networking', desc: 'Connect with young entrepreneurs and professionals for mutual growth.' },
            { icon: 'fa-globe', title: 'International Ties', desc: 'Join a massive global network across 100+ countries.' }
          ].map((area, i) => (
            <div key={i} className="p-10 rounded-[3rem] bg-[#f8fafc] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center">
              <div className="w-16 h-16 rounded-2xl bg-white text-primary flex items-center justify-center mb-8 mx-auto shadow-sm"><i className={`fas ${area.icon} text-2xl`}></i></div>
              <h3 className="text-xl font-black text-secondary mb-4">{area.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{area.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM MEMBERS SECTION */}
      {teamMembers.length > 0 && (
        <section className="relative py-32 px-6 bg-white z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24 reveal-up">
              <h2 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter uppercase">Current <span className="gradient-text">Leadership</span></h2>
              <div className="w-24 h-1.5 bg-primary mx-auto mt-8 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, i) => (
                <div key={member._id || i} className="group relative p-8 rounded-[3rem] bg-[#f8fafc] border border-slate-100 transition-all duration-700 hover:-translate-y-2 hover:shadow-xl">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-black text-secondary mb-2 uppercase">{member.name}</h4>
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative py-32 px-6 bg-[#f8fafc] overflow-hidden z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 reveal-up">
            <h2 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter uppercase">Presidents of <span className="gradient-text">Midtown</span></h2>
            <div className="w-24 h-1.5 bg-primary mx-auto mt-8 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {presidents.map((p, i) => (
              <div key={p._id || i} className="group relative p-10 rounded-[3.5rem] bg-white border border-slate-100 transition-all duration-700 hover:-translate-y-4 hover:shadow-xl overflow-hidden">
                <div className="relative w-48 h-48 mx-auto mb-10 z-10">
                  <div className="w-full h-full rounded-[3.2rem] p-1.5 bg-gradient-to-tr from-primary to-secondary shadow-lg overflow-hidden transform group-hover:scale-105 transition-all">
                    <div className="w-full h-full rounded-[2.8rem] overflow-hidden border-[6px] border-white bg-white">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" loading="lazy" />
                    </div>
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-2xl shadow-xl border border-slate-50 z-20 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <span className="text-[12px] font-black tracking-widest">{p.year}</span>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-2xl font-black text-secondary mb-4 tracking-tight group-hover:text-primary transition-colors">{p.name}</h3>
                  <div className="h-[2px] w-12 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-40 px-6 z-10 bg-[#0f4c75]">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h3 className="text-5xl md:text-7xl font-black mb-24 tracking-tighter reveal-up uppercase">A World of <span className="gradient-text-v2">Impact</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { target: '200000', label: 'Active Members' },
              { target: '100', label: 'Countries' },
              { target: '5000', label: 'Local Chapters' }
            ].map((stat, idx) => (
              <div key={idx} className="reveal-up p-12 bg-white/5 border border-white/10 backdrop-blur-md rounded-[3.5rem] group hover:bg-white/10 transition-all">
                <h3 className="text-6xl font-black mb-4 counter text-primary" data-target={stat.target}>0</h3>
                <p className="text-white/40 font-black uppercase tracking-widest text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .gradient-text { background: linear-gradient(to right, #00c6a7, #0f4c75); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .gradient-text-v2 { background: linear-gradient(to bottom right, #ffffff, #00c6a7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>
    </div>
  );
};

export default About;
