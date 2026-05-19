import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { eventService } from '../../services/api';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  const [enquiryData, setEnquiryData] = useState({ name: '', email: '', phone: '', location: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo('.contact-reveal', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
      );
    }, mainRef);
    return () => ctx.revert();
  }, []);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryData.name || !enquiryData.email || !enquiryData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await eventService.addEnquiry(enquiryData);
      alert('Enquiry sent successfully!');
      setEnquiryData({ name: '', email: '', phone: '', location: '', message: '' });
    } catch (error) {
      alert('Error sending enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-40 pb-24 px-6 overflow-hidden" ref={mainRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 contact-reveal">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-6 border border-primary/20">Get In Touch</span>
          <h1 className="text-5xl md:text-8xl font-black text-secondary tracking-tighter mb-8 leading-none uppercase">Contact <span className="gradient-text">Us</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-xl font-medium">Empowering connections for global change. We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-12 contact-reveal">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
              <h3 className="text-2xl font-black text-secondary mb-10 uppercase tracking-tighter">Directory</h3>
              <div className="space-y-10">
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl shadow-inner"><MapPin /></div>
                  <div><h4 className="font-black text-secondary uppercase text-sm">Location</h4><p className="text-gray-400 font-medium">Salem, Tamil Nadu, India</p></div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl shadow-inner"><Phone /></div>
                  <div><h4 className="font-black text-secondary uppercase text-sm">Phone</h4><a href="tel:+919943055055" className="text-gray-400 font-medium hover:text-primary transition-colors">+91 99430 55055</a></div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl shadow-inner"><Mail /></div>
                  <div><h4 className="font-black text-secondary uppercase text-sm">Email</h4><a href="mailto:info@jcisalemmidtown.com" className="text-gray-400 font-medium hover:text-primary transition-colors">info@jcisalemmidtown.com</a></div>
                </div>
              </div>
            </div>
            <div className="relative rounded-[3.5rem] overflow-hidden h-[350px] shadow-2xl border-[12px] border-white group">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125031.57904791557!2d78.0772221!3d11.6666667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf059039e6027%3A0x6b772c95e1434c4f!2sSalem%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1713689400000!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" title="Location Map"></iframe>
            </div>
          </div>

          <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl border border-slate-50 contact-reveal">
            <h2 className="text-4xl font-black text-secondary mb-12 tracking-tighter uppercase">Send <span className="text-primary">Dispatch</span></h2>
            <form onSubmit={handleEnquirySubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input type="text" value={enquiryData.name} onChange={(e) => setEnquiryData({...enquiryData, name: e.target.value})} required className="w-full p-6 rounded-3xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-primary/10 text-secondary font-black text-sm" placeholder="Full Name" />
                <input type="text" value={enquiryData.location} onChange={(e) => setEnquiryData({...enquiryData, location: e.target.value})} required className="w-full p-6 rounded-3xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-primary/10 text-secondary font-black text-sm" placeholder="City/Region" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input type="email" value={enquiryData.email} onChange={(e) => setEnquiryData({...enquiryData, email: e.target.value})} required className="w-full p-6 rounded-3xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-primary/10 text-secondary font-black text-sm" placeholder="Email Address" />
                <input type="tel" value={enquiryData.phone} onChange={(e) => setEnquiryData({...enquiryData, phone: e.target.value})} required className="w-full p-6 rounded-3xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-primary/10 text-secondary font-black text-sm" placeholder="Contact Number" />
              </div>
              <textarea value={enquiryData.message} onChange={(e) => setEnquiryData({...enquiryData, message: e.target.value})} rows={5} required className="w-full p-6 rounded-3xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-primary/10 text-secondary font-black text-sm" placeholder="State your objective..."></textarea>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-lg group">
                {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <>Initialize Communication <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        .gradient-text { background: linear-gradient(to right, #00c6a7, #0f4c75); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>
    </div>
  );
};

export default Contact;
