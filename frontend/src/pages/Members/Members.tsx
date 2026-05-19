import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { eventService } from '../../services/api';
import type { TeamMember } from '../../services/api';
import { ShieldCheck, Cpu } from 'lucide-react';

// Register ScrollTrigger once
gsap.registerPlugin(ScrollTrigger);

const Members = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    eventService.getMembers().then((res) => {
      if (res.data) setTeamMembers(res.data);
      setLoading(false);
    }).catch(console.error);

    let ctx = gsap.context(() => {
      gsap.fromTo('.members-header-reveal', 
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: 'expo.out', stagger: 0.2 }
      );
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const getOneByRole = (role: string) => teamMembers.find(m => m.role?.toLowerCase().includes(role.toLowerCase()));
  
  const getGeneralMembers = () => {
    const hierarchyRoles = ['Advisor', 'Chairman', 'Event Manager', 'Finance', 'Sponsorship', 'Marketing', 'Logistic', 'Food'];
    return teamMembers.filter(m => !hierarchyRoles.some(r => m.role?.toLowerCase().includes(r.toLowerCase())));
  };

  const MemberNode = ({ member, role, color, isMain }: { member?: TeamMember, role: string, color: string, isMain?: boolean }) => (
    <div className={`group relative flex flex-col items-center transition-all duration-700 ${isMain ? 'scale-110 z-30' : 'scale-100 z-20 hover:scale-105'}`}>
      <div className="relative p-1 rounded-[3.5rem] bg-gradient-to-tr from-primary via-white/50 to-secondary shadow-xl overflow-hidden">
        <div className="bg-white rounded-[3.2rem] p-8 md:p-10 flex flex-col items-center min-w-[280px] relative">
          <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${color}`}></div>
          <div className="mb-8">
             <div className="relative w-32 h-32 md:w-40 md:h-40">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-spin-slow"></div>
                <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-slate-50">
                   <img src={member?.image || 'https://via.placeholder.com/400x400?text=Leader'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-white border-2 border-white shadow-xl">
                   <ShieldCheck className="w-5 h-5" />
                </div>
             </div>
          </div>
          <div className="text-center">
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">{role}</p>
             <h4 className="text-xl md:text-2xl font-black text-secondary tracking-tighter uppercase leading-tight line-clamp-1">{member?.name || 'Assigned Soon'}</h4>
             <div className="w-8 h-1 bg-slate-100 mx-auto mt-4 rounded-full group-hover:w-16 group-hover:bg-primary transition-all duration-500"></div>
          </div>
        </div>
      </div>
      {!isMain && <div className="h-16 w-0.5 bg-gradient-to-b from-slate-200 to-transparent"></div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-40 pb-32 px-4" ref={mainRef}>
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #0f4c75 1px, transparent 0)` , backgroundSize: '40px 40px' }}></div>
      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="text-center mb-32 max-w-4xl mx-auto">
          <div className="members-header-reveal inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/5 border border-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-8">
            <Cpu className="w-3 h-3 text-primary" /> Command Hierarchy
          </div>
          <h1 className="members-header-reveal text-6xl md:text-8xl font-black text-secondary tracking-tighter mb-8 leading-[0.9]">Meet the <span className="gradient-text">Architects</span></h1>
          <p className="members-header-reveal text-gray-400 text-xl font-medium">The visionary minds orchestrating impact and excellence.</p>
        </div>
        
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-40">
             <div className="flex flex-col items-center">
                <div className="mb-20">
                   <MemberNode member={getOneByRole('Advisor')} role="Strategic Advisor" color="from-secondary to-primary" isMain />
                   <div className="h-24 w-0.5 bg-gradient-to-b from-primary to-slate-200 mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-40 relative">
                   <MemberNode member={getOneByRole('Chairman')} role="The Chairman" color="from-primary to-secondary" />
                   <MemberNode member={getOneByRole('Event Manager')} role="Operations Chief" color="from-primary to-secondary" />
                </div>
             </div>
             <div className="pt-40 border-t border-slate-100">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 px-4">
                   {getGeneralMembers().map((m, i) => (
                      <div key={m._id || i} className="group relative flex flex-col items-center">
                         <div className="relative w-24 h-24 md:w-32 md:h-32 mb-6">
                            <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-2 border-white shadow-xl bg-white transform transition-all duration-700 group-hover:scale-110">
                               <img src={m.image} className="w-full h-full object-cover" alt="" />
                            </div>
                         </div>
                         <div className="text-center">
                            <h5 className="text-xs md:text-sm font-black text-secondary uppercase tracking-tight mb-1 group-hover:text-primary transition-colors">{m.name}</h5>
                            <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.role}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
      <style>{`
        .gradient-text { background: linear-gradient(to right, #00c6a7, #0f4c75); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </div>
  );
};

export default Members;
