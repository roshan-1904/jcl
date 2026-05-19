import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { eventService } from '../../services/api';
import type { Event, TeamMember, Enquiry, President, AboutContent } from '../../services/api';
import { 
  Calendar, 
  User, 
  Users, 
  Inbox, 
  LogOut, 
  Trash2, 
  Edit3, 
  Upload, 
  ChevronRight,
  MessageSquare,
  Download,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Square,
  CheckSquare
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState<'events' | 'team' | 'enquiries' | 'presidents' | 'about' | 'legacy'>('events');
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // Common State
  const [isUploading, setIsUploading] = useState(false);

  // Data States
  const [events, setEvents] = useState<Event[]>([]);
  const [presidents, setPresidents] = useState<President[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [legacyImages, setLegacyImages] = useState<LegacyImage[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    title: '', subtitle: '', description: '', image: ''
  });

  // Selection State
  const [selectedPresidents, setSelectedPresidents] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [selectedLegacy, setSelectedLegacy] = useState<string[]>([]);

  // Form States (Events)
  const [isEditEventMode, setIsEditEventMode] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    title: '', date: '', time: '', location: '', description: '', type: 'Major Event', image: ''
  });

  // Form States (Team)
  const [isEditMemberMode, setIsEditMemberMode] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<TeamMember>({
    name: '', role: '', bio: '', image: '', order: 0
  });

  // Form States (Presidents)
  const [isEditPresMode, setIsEditPresMode] = useState(false);
  const [editingPresId, setEditingPresId] = useState<string | null>(null);
  const [newPres, setNewPres] = useState<President>({ name: '', year: '', image: '' });

  // Form States (Legacy)
  const [newLegacyImage, setNewLegacyImage] = useState<LegacyImage>({ image: '', title: '' });

  useEffect(() => {
    loadAllData();
    gsap.fromTo(mainRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' });
  }, []);

  // Handle Tab Transitions
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    gsap.fromTo(".tab-content-reveal", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", delay: 0.1 }
    );
  }, [currentTab]);

  const loadAllData = () => {
    eventService.getEvents().then(res => setEvents(res.data)).catch(console.error);
    eventService.getPresidents().then(res => setPresidents(res.data)).catch(console.error);
    eventService.getMembers().then(res => setMembers(res.data)).catch(console.error);
    eventService.getEnquiries().then(res => setEnquiries(res.data)).catch(console.error);
    eventService.getAboutContent().then(res => setAboutContent(res.data)).catch(console.error);
    eventService.getLegacyImages().then(res => setLegacyImages(res.data)).catch(console.error);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'event' | 'member' | 'president' | 'about' | 'legacy') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("File too large! (Max 5MB)"); return; }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'event') setNewEvent({ ...newEvent, image: base64 });
      else if (type === 'member') setNewMember({ ...newMember, image: base64 });
      else if (type === 'president') setNewPres({ ...newPres, image: base64 });
      else if (type === 'about') setAboutContent({ ...aboutContent, image: base64 });
      else if (type === 'legacy') setNewLegacyImage({ ...newLegacyImage, image: base64 });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // --- SAVE METHODS ---
  const saveAboutContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await eventService.updateAboutContent(aboutContent);
      alert('About Content Updated!');
    } catch (error) { alert('Error updating about content'); }
  };

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.image) {
      alert('Please select an event thumbnail image');
      return;
    }
    try {
      if (isEditEventMode && editingEventId) await eventService.updateEvent(editingEventId, newEvent);
      else await eventService.addEvent(newEvent);
      resetEventForm(); loadAllData(); alert('Event Saved!');
    } catch (error: any) { 
      const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
      alert('Error saving event: ' + errorMsg); 
    }
  };

  const saveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMemberMode && editingMemberId) await eventService.updateMember(editingMemberId, newMember);
      else await eventService.addMember(newMember);
      resetMemberForm(); loadAllData(); alert('Member Saved!');
    } catch (error) { alert('Error saving member'); }
  };

  const savePres = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditPresMode && editingPresId) await eventService.updatePresident(editingPresId, newPres);
      else await eventService.addPresident(newPres);
      resetPresForm(); loadAllData(); alert('President Saved!');
    } catch (error) { alert('Error saving president'); }
  };

  const saveLegacyImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLegacyImage.image) {
      alert('Please select an image');
      return;
    }
    try {
      await eventService.addLegacyImage(newLegacyImage);
      setNewLegacyImage({ image: '', title: '' });
      loadAllData();
      alert('Legacy Image Added!');
    } catch (error) { alert('Error adding legacy image'); }
  };

  // --- DELETE METHODS ---
  const deleteItem = async (id: string, type: 'event' | 'member' | 'president' | 'enquiry' | 'legacy') => {
    if (!window.confirm('Are you sure?')) return;
    if (type === 'event') await eventService.deleteEvent(id);
    else if (type === 'member') await eventService.deleteMember(id);
    else if (type === 'president') await eventService.deletePresident(id);
    else if (type === 'enquiry') await eventService.deleteEnquiry(id);
    else if (type === 'legacy') await eventService.deleteLegacyImage(id);
    loadAllData();
  };

  const deleteSelectedEvents = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedEvents.length} selected events?`)) return;
    try {
      await Promise.all(selectedEvents.map(id => eventService.deleteEvent(id)));
      setSelectedEvents([]);
      loadAllData();
      alert('Selected events deleted!');
    } catch (error) {
      alert('Error deleting selected events');
    }
  };

  const deleteSelectedPresidents = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedPresidents.length} selected presidents?`)) return;
    try {
      await Promise.all(selectedPresidents.map(id => eventService.deletePresident(id)));
      setSelectedPresidents([]);
      loadAllData();
      alert('Selected presidents deleted!');
    } catch (error) {
      alert('Error deleting selected presidents');
    }
  };

  const deleteSelectedLegacy = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedLegacy.length} selected memories?`)) return;
    try {
      await Promise.all(selectedLegacy.map(id => eventService.deleteLegacyImage(id)));
      setSelectedLegacy([]);
      loadAllData();
      alert('Selected memories deleted!');
    } catch (error) {
      alert('Error deleting selected memories');
    }
  };

  // --- SELECTION METHODS ---
  const toggleSelectEvent = (id: string) => {
    setSelectedEvents(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllEvents = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map(e => e._id!));
    }
  };

  const toggleSelectPresident = (id: string) => {
    setSelectedPresidents(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllPresidents = () => {
    if (selectedPresidents.length === presidents.length) {
      setSelectedPresidents([]);
    } else {
      setSelectedPresidents(presidents.map(p => p._id!));
    }
  };

  const toggleSelectLegacy = (id: string) => {
    setSelectedLegacy(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllLegacy = () => {
    if (selectedLegacy.length === legacyImages.length) {
      setSelectedLegacy([]);
    } else {
      setSelectedLegacy(legacyImages.map(img => img._id!));
    }
  };

  // --- EXPORT METHODS ---
  const exportEventsToPDF = () => {
    const doc = new jsPDF();
    doc.text("JCI Salem Midtown - Events List", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Title', 'Type', 'Date', 'Location']],
      body: events.map(e => [e.title, e.type, e.date, e.location]),
    });
    doc.save('events_list.pdf');
  };

  const exportEventsToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(events.map(e => ({ Title: e.title, Type: e.type, Date: e.date, Location: e.location })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Events");
    XLSX.writeFile(wb, 'events_list.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("JCI Salem Midtown - Past Presidents", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Name', 'Year']],
      body: presidents.map(p => [p.name, p.year]),
    });
    doc.save('presidents_list.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(presidents.map(p => ({ Name: p.name, Year: p.year })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Presidents");
    XLSX.writeFile(wb, 'presidents_list.xlsx');
  };

  const exportToImage = async () => {
    if (tableRef.current) {
      const canvas = await html2canvas(tableRef.current);
      const link = document.createElement('a');
      link.download = 'presidents_table.jpg';
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    }
  };

  // --- EDIT START METHODS ---
  const startEventEdit = (e: Event) => { setIsEditEventMode(true); setEditingEventId(e._id!); setNewEvent({...e}); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const startMemberEdit = (m: TeamMember) => { setIsEditMemberMode(true); setEditingMemberId(m._id!); setNewMember({...m}); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const startPresEdit = (p: President) => { setIsEditPresMode(true); setEditingPresId(p._id!); setNewPres({ name: p.name, year: p.year, image: p.image }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // --- RESET METHODS ---
  const resetEventForm = () => { setIsEditEventMode(false); setEditingEventId(null); setNewEvent({ title: '', date: '', time: '', location: '', description: '', type: 'Major Event', image: '' }); };
  const resetMemberForm = () => { setIsEditMemberMode(false); setEditingMemberId(null); setNewMember({ name: '', role: '', bio: '', image: '', order: 0 }); };
  const resetPresForm = () => { setIsEditPresMode(false); setEditingPresId(null); setNewPres({ name: '', year: '', image: '' }); };

  const handleLogout = () => { localStorage.removeItem('isAdminAuthenticated'); navigate('/admin/login'); };

  return (
    <div className="h-screen bg-[#f8fafc] flex font-sans selection:bg-primary/20 overflow-hidden" ref={mainRef}>
      {/* 🚀 PREMIUM SIDEBAR (Stationary) */}
      <aside className="w-72 bg-[#0f4c75] text-white flex flex-col h-full z-50 shadow-2xl shrink-0">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
               <img src="https://www.jcislmmidtown.com/assets/images/logo-default.png" alt="Logo" className="w-7 h-auto" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">Midtown<span className="text-primary text-2xl">.</span></span>
          </div>
          <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/40 ml-1">Admin Experience</p>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
          {[
            { id: 'events', label: 'Events', icon: <Calendar className="w-5 h-5" /> },
            /* { id: 'presidents', label: 'Presidents', icon: <User className="w-5 h-5" /> }, */
            { id: 'team', label: 'Team', icon: <Users className="w-5 h-5" /> },
            { id: 'legacy', label: 'Legacy Gallery', icon: <ImageIcon className="w-5 h-5" /> },
            { id: 'about', label: 'About Page', icon: <Edit3 className="w-5 h-5" /> },
            { id: 'enquiries', label: 'Inquiries', icon: <Inbox className="w-5 h-5" /> },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setCurrentTab(tab.id as any)}
              className={`flex items-center space-x-4 w-full px-5 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
                currentTab === tab.id ? 'bg-gradient-to-r from-primary to-[#00b094] text-white shadow-xl' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}>
              {tab.icon} <span className="tracking-wide">{tab.label}</span>
              {currentTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-6 py-4 rounded-2xl text-sm font-black text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300">
            <LogOut className="w-5 h-5" /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 💎 MAIN CONTENT AREA (The only part that scrolls) */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent -z-10 blur-[100px]"></div>
        
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
           <h2 className="text-2xl font-black text-secondary tracking-tight capitalize flex items-center gap-3">
              {currentTab} <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest font-black">Management</span>
           </h2>
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-xl">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-secondary font-black">A</div>
           </div>
        </header>

        {/* 🚀 This is the only scrolling part */}
        <div className="flex-1 overflow-y-auto scroll-smooth touch-pan-y" ref={scrollRef} data-lenis-prevent>
          <div className="p-10 max-w-6xl mx-auto pb-32 tab-content-reveal">
            {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Events', val: events.length, icon: <Calendar className="text-blue-500" /> },
              /* { label: 'Presidents', val: presidents.length, icon: <User className="text-primary" /> }, */
              { label: 'Team', val: members.length, icon: <Users className="text-purple-500" /> },
              { label: 'Inquiries', val: enquiries.length, icon: <Inbox className="text-orange-500" /> },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4">{stat.icon}</div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-black text-secondary mt-1 tracking-tighter">{stat.val}</h3>
              </div>
            ))}
          </div>

          {/* --- EVENTS TAB --- */}
          {currentTab === 'events' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-8">
                <h3 className="text-lg font-black text-secondary mb-6">{isEditEventMode ? 'Update Event' : 'Create New Event'}</h3>
                <form onSubmit={saveEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Event Title" className="admin-input-premium" required />
                  <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})} className="admin-input-premium">
                    <option value="Major Event">Major Event</option><option value="Training">Training</option><option value="Community">Community</option><option value="Business">Business</option>
                  </select>
                  <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="admin-input-premium" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} placeholder="Time (e.g. 10:00 AM)" className="admin-input-premium" required />
                    <input type="text" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} placeholder="Location" className="admin-input-premium" required />
                  </div>
                  <div className="col-span-full">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Event Thumbnail (Required)</label>
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'event')} className="hidden" id="event-upload" />
                    <label htmlFor="event-upload" className="w-full py-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center cursor-pointer hover:bg-primary/5 transition-all">
                      {newEvent.image ? <img src={newEvent.image} className="h-16 w-24 object-cover rounded-lg mb-2" alt="" /> : <Upload className="text-slate-300 mb-1 w-5 h-5" />}
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{newEvent.image ? 'Change Image' : 'Select Image'}</span>
                    </label>
                  </div>
                  <textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="Event Description" className="admin-input-premium col-span-full" rows={3} required />
                  <div className="col-span-full flex justify-end gap-4">
                    {isEditEventMode && <button type="button" onClick={resetEventForm} className="text-xs font-black text-slate-400 uppercase">Cancel</button>}
                    <button type="submit" disabled={isUploading} className="btn-primary min-w-[180px] py-3 text-xs">Save Event</button>
                  </div>
                </form>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
                 <div className="flex items-center gap-3">
                    {selectedEvents.length > 0 && (
                       <button onClick={deleteSelectedEvents} className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                          <Trash2 className="w-3 h-3" /> Delete Selected ({selectedEvents.length})
                       </button>
                    )}
                 </div>
                 <div className="flex items-center gap-2">
                    <button onClick={exportEventsToPDF} className="p-2.5 bg-white rounded-lg border border-slate-100 text-secondary hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-2 font-black text-[9px] uppercase tracking-widest">
                       <FileText className="w-3 h-3" /> PDF
                    </button>
                    <button onClick={exportEventsToExcel} className="p-2.5 bg-white rounded-lg border border-slate-100 text-secondary hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-2 font-black text-[9px] uppercase tracking-widest">
                       <FileSpreadsheet className="w-3 h-3" /> Excel
                    </button>
                 </div>
              </div>

              <div className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 w-10">
                        <button onClick={toggleSelectAllEvents} className="text-slate-300 hover:text-primary transition-colors">
                           {selectedEvents.length === events.length && events.length > 0 ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Event Detail</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Schedule</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(e => (
                      <tr key={e._id} className={`border-b border-slate-50 hover:bg-slate-50/30 transition-all group ${selectedEvents.includes(e._id!) ? 'bg-primary/5' : ''}`}>
                        <td className="px-6 py-4">
                           <button onClick={() => toggleSelectEvent(e._id!)} className="text-slate-200 hover:text-primary transition-colors">
                              {selectedEvents.includes(e._id!) ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                           </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-9 rounded-lg overflow-hidden border-2 border-white shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                              <img src={e.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                               <p className="font-black text-secondary uppercase tracking-tight line-clamp-1 text-xs">{e.title}</p>
                               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{e.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[8px] font-black uppercase tracking-widest border border-secondary/20">{e.type}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-primary uppercase">{e.date}</span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase">{e.time}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => startEventEdit(e)} className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-blue-500 shadow-sm hover:bg-blue-500 hover:text-white transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => deleteItem(e._id!, 'event')} className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- PRESIDENTS TAB --- */}
          {/* currentTab === 'presidents' && (
            <div className="space-y-10 animate-fade-in">
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
                <h3 className="text-xl font-black text-secondary mb-8">{isEditPresMode ? 'Update Leadership Record' : 'Register New President'}</h3>
                <form onSubmit={savePres} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input type="text" value={newPres.name} onChange={e => setNewPres({...newPres, name: e.target.value})} placeholder="Jc. Name" className="admin-input-premium" required />
                  <input type="text" value={newPres.year} onChange={e => setNewPres({...newPres, year: e.target.value})} placeholder="Year (e.g. 2026)" className="admin-input-premium" required />
                  <div className="col-span-full">
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'president')} className="hidden" id="pres-upload" />
                    <label htmlFor="pres-upload" className="w-full py-16 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                      {newPres.image ? <img src={newPres.image} className="w-32 h-32 rounded-[2rem] object-cover shadow-2xl mb-4 border-4 border-white" alt="" /> : <Upload className="w-10 h-10 text-slate-200 mb-4" />}
                      <p className="font-black text-secondary/60 uppercase text-xs tracking-widest">{isUploading ? 'Uploading...' : 'Choose Photo'}</p>
                    </label>
                  </div>
                  <div className="col-span-full flex justify-end gap-4 pt-6">
                    {isEditPresMode && <button type="button" onClick={resetPresForm} className="text-xs font-black text-slate-400 uppercase">Cancel</button>}
                    <button type="submit" disabled={isUploading || !newPres.image} className="btn-primary min-w-[200px]">Save President</button>
                  </div>
                </form>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                 <div className="flex items-center gap-4">
                    {selectedPresidents.length > 0 && (
                       <button onClick={deleteSelectedPresidents} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                          <Trash2 className="w-4 h-4" /> Delete Selected ({selectedPresidents.length})
                       </button>
                    )}
                 </div>
                 <div className="flex items-center gap-3">
                    <button onClick={exportToPDF} className="p-3 bg-white rounded-xl border border-slate-100 text-secondary hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                       <FileText className="w-4 h-4" /> PDF
                    </button>
                    <button onClick={exportToExcel} className="p-3 bg-white rounded-xl border border-slate-100 text-secondary hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                       <FileSpreadsheet className="w-4 h-4" /> Excel
                    </button>
                    <button onClick={exportToImage} className="p-3 bg-white rounded-xl border border-slate-100 text-secondary hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                       <ImageIcon className="w-4 h-4" /> JPG
                    </button>
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
                <table className="w-full text-left border-collapse" ref={tableRef}>
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 w-10">
                        <button onClick={toggleSelectAllPresidents} className="text-slate-300 hover:text-primary transition-colors">
                           {selectedPresidents.length === presidents.length && presidents.length > 0 ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5" />}
                        </button>
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Leader</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Year</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presidents.map(p => (
                      <tr key={p._id || p.name} className={`border-b border-slate-50 hover:bg-slate-50/30 transition-all group ${selectedPresidents.includes(p._id!) ? 'bg-primary/5' : ''}`}>
                        <td className="px-8 py-5">
                           <button onClick={() => toggleSelectPresident(p._id!)} className="text-slate-200 hover:text-primary transition-colors">
                              {selectedPresidents.includes(p._id!) ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5" />}
                           </button>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                              <img src={p.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <span className="font-black text-secondary uppercase tracking-tight">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">{p.year}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => startPresEdit(p)} className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-500 shadow-sm hover:bg-blue-500 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => deleteItem(p._id!, 'president')} className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) */ }

          {/* --- TEAM TAB --- */}
          {currentTab === 'team' && (
            <div className="space-y-6 animate-fade-in">
               <div className="bg-white p-8 rounded-[1.5rem] border border-slate-100">
                  <h3 className="text-lg font-black text-secondary mb-6">Manage Active Team</h3>
                  <form onSubmit={saveMember} className="grid grid-cols-2 gap-6">
                     <input type="text" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="Name" className="admin-input-premium" />
                     <input type="text" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} placeholder="Role" className="admin-input-premium" />
                     <div className="col-span-full">
                        <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'member')} className="hidden" id="member-upload" />
                        <label htmlFor="member-upload" className="w-full py-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center cursor-pointer hover:bg-primary/5 transition-all">
                          {newMember.image ? <img src={newMember.image} className="h-16 w-16 rounded-full object-cover mb-2" alt="" /> : <Upload className="text-slate-300 w-5 h-5" />}
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Profile Photo</span>
                        </label>
                     </div>
                     <textarea value={newMember.bio} onChange={e => setNewMember({...newMember, bio: e.target.value})} placeholder="Short Bio" className="admin-input-premium col-span-full" rows={2} />
                     <button type="submit" className="btn-primary col-span-full py-3 text-xs">Save Team Member</button>
                  </form>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {members.map(m => (
                    <div key={m._id} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <img src={m.image} className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white" alt="" />
                          <div><p className="font-black text-secondary text-sm">{m.name}</p><p className="text-[9px] font-bold text-primary uppercase">{m.role}</p></div>
                       </div>
                       <div className="flex gap-3">
                          <button onClick={() => startMemberEdit(m)} className="text-blue-500"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => deleteItem(m._id!, 'member')} className="text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* --- ABOUT TAB --- */}
          {currentTab === 'about' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-secondary mb-6">Manage About Page Intro</h3>
                <form onSubmit={saveAboutContent} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" value={aboutContent.title} onChange={e => setAboutContent({...aboutContent, title: e.target.value})} placeholder="Title (e.g. About JCI MidTown)" className="admin-input-premium" />
                    <input type="text" value={aboutContent.subtitle} onChange={e => setAboutContent({...aboutContent, subtitle: e.target.value})} placeholder="Subtitle (e.g. Leadership Since 1981)" className="admin-input-premium" />
                  </div>
                  <textarea value={aboutContent.description} onChange={e => setAboutContent({...aboutContent, description: e.target.value})} placeholder="Main Description Text" className="admin-input-premium" rows={5} />
                  
                  <div className="col-span-full">
                    <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">Main About Image</label>
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'about')} className="hidden" id="about-image-upload" />
                    <label htmlFor="about-image-upload" className="w-full py-12 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                      {aboutContent.image ? <img src={aboutContent.image} className="h-32 w-56 object-cover rounded-xl mb-3 shadow-xl" alt="" /> : <Upload className="text-slate-200 mb-3 w-8 h-8" />}
                      <p className="font-black text-secondary/60 uppercase text-[10px] tracking-widest">Change About Image</p>
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="btn-primary min-w-[180px] py-3 text-xs">Update About Page</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* --- LEGACY TAB --- */}
          {currentTab === 'legacy' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-secondary mb-6">Add to Legacy Gallery</h3>
                <form onSubmit={saveLegacyImage} className="space-y-6">
                  <input type="text" value={newLegacyImage.title} onChange={e => setNewLegacyImage({...newLegacyImage, title: e.target.value})} placeholder="Memory Title (Optional)" className="admin-input-premium" />
                  <div className="col-span-full">
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'legacy')} className="hidden" id="legacy-upload" />
                    <label htmlFor="legacy-upload" className="w-full py-12 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                      {newLegacyImage.image ? <img src={newLegacyImage.image} className="h-32 w-56 object-cover rounded-xl mb-3 shadow-xl" alt="" /> : <Upload className="w-10 h-10 text-slate-200 mb-3" />}
                      <p className="font-black text-secondary/60 uppercase text-[10px] tracking-widest">{isUploading ? 'Uploading...' : 'Select Memory Photo'}</p>
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={isUploading || !newLegacyImage.image} className="btn-primary min-w-[180px] py-3 text-xs">Push to Gallery</button>
                  </div>
                </form>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
                 <div className="flex items-center gap-3">
                    {selectedLegacy.length > 0 && (
                       <button onClick={deleteSelectedLegacy} className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                          <Trash2 className="w-3 h-3" /> Delete Selected ({selectedLegacy.length})
                       </button>
                    )}
                 </div>
              </div>

              <div className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 w-10">
                        <button onClick={toggleSelectAllLegacy} className="text-slate-300 hover:text-primary transition-colors">
                           {selectedLegacy.length === legacyImages.length && legacyImages.length > 0 ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Memory Preview</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Title / Label</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {legacyImages.map(img => (
                      <tr key={img._id} className={`border-b border-slate-50 hover:bg-slate-50/30 transition-all group ${selectedLegacy.includes(img._id!) ? 'bg-primary/5' : ''}`}>
                        <td className="px-6 py-4">
                           <button onClick={() => toggleSelectLegacy(img._id!)} className="text-slate-200 hover:text-primary transition-colors">
                              {selectedLegacy.includes(img._id!) ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                           </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-16 h-11 rounded-lg overflow-hidden border-2 border-white shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                            <img src={img.image} className="w-full h-full object-cover" alt="" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-black text-secondary uppercase tracking-tight text-xs">{img.title || 'Chapter Memory'}</p>
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Added on {new Date(img.createdAt!).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => deleteItem(img._id!, 'legacy')} className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- INQUIRIES TAB --- */}
          {currentTab === 'enquiries' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden animate-fade-in shadow-sm">
               {enquiries.map(eq => (
                 <div key={eq._id} className="p-8 border-b border-slate-50 flex items-start justify-between hover:bg-slate-50/50 transition-all">
                    <div className="flex gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0"><MessageSquare className="w-5 h-5" /></div>
                       <div>
                          <p className="font-black text-secondary text-lg">{eq.name} • <span className="text-primary text-xs uppercase tracking-widest">{eq.location}</span></p>
                          <p className="text-xs font-bold text-slate-400 mb-4">{eq.email} • {eq.phone}</p>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 text-sm">"{eq.message}"</div>
                       </div>
                    </div>
                    <button onClick={() => deleteItem(eq._id!, 'enquiry')} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-red-500 shadow-sm flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                 </div>
               ))}
               {enquiries.length === 0 && <div className="py-32 text-center opacity-20 uppercase font-black tracking-widest text-sm">Inbox is empty</div>}
            </div>
          )}
        </div>
      </div>
    </main>

    <style>{`
      .admin-input-premium { @apply w-full px-6 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-secondary placeholder:text-slate-300 focus:bg-white focus:ring-[8px] focus:ring-primary/5 focus:border-primary outline-none transition-all duration-300; }
      .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
