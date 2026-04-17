import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, Event, TeamMember, Enquiry } from '../../services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#f8fafc] flex font-sans">
      
      <!-- SIDEBAR -->
      <aside class="w-72 bg-[#0f172a] text-slate-300 flex flex-col fixed h-full z-50 transition-all duration-300">
        <div class="p-8 border-b border-slate-800/50">
          <div class="flex items-center space-x-3 mb-4">
            <div class="bg-white p-2 rounded-xl shadow-lg">
              <img src="https://www.jcislmmidtown.com/assets/images/logo-default.png" alt="Logo" class="h-8 w-auto object-contain">
            </div>
            <h1 class="text-xl font-black text-white tracking-tight">Admin<span class="text-primary text-2xl">.</span></h1>
          </div>
          <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">JCI Salem Midtown</p>
        </div>

        <nav class="flex-1 px-4 py-8 space-y-2">
          <button (click)="currentTab = 'events'" 
                  [class.active-nav]="currentTab === 'events'"
                  class="nav-item group">
            <i class="fas fa-calendar-alt w-6 group-hover:text-primary transition-colors"></i>
            <span>Manage Events</span>
          </button>
          
          <button (click)="currentTab = 'team'" 
                  [class.active-nav]="currentTab === 'team'"
                  class="nav-item group">
            <i class="fas fa-users-cog w-6 group-hover:text-primary transition-colors"></i>
            <span>Team Members</span>
          </button>
          
          <button (click)="currentTab = 'enquiries'" 
                  [class.active-nav]="currentTab === 'enquiries'"
                  class="nav-item group relative">
            <i class="fas fa-inbox w-6 group-hover:text-primary transition-colors"></i>
            <span>User Inquiries</span>
            <span *ngIf="enquiries.length > 0" class="absolute right-4 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">
              {{ enquiries.length }}
            </span>
          </button>
        </nav>

        <div class="p-6 border-t border-slate-800/50">
          <button (click)="logout()" class="flex items-center space-x-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-sm text-slate-400">
            <i class="fas fa-sign-out-alt"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="flex-1 ml-72 min-h-screen">
        
        <!-- TOP HEADER -->
        <header class="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div class="flex items-center space-x-2">
            <span class="text-slate-400 font-medium">Dashboard</span>
            <i class="fas fa-chevron-right text-[10px] text-slate-300"></i>
            <span class="text-slate-800 font-bold capitalize">{{ currentTab }}</span>
          </div>
          
          <div class="flex items-center space-x-6">
            <div class="flex flex-col items-end">
              <span class="text-sm font-black text-slate-800">Admin User</span>
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Super Administrator</span>
            </div>
            <div class="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff" alt="avatar">
            </div>
          </div>
        </header>

        <div class="p-10 max-w-6xl">
          
          <!-- SUMMARY CARDS -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div class="stats-card">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <i class="fas fa-calendar-check text-xl"></i>
                </div>
                <span class="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg">+12%</span>
              </div>
              <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Events</p>
              <h3 class="text-3xl font-black text-slate-800">{{ events.length }}</h3>
            </div>

            <div class="stats-card">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <i class="fas fa-user-friends text-xl"></i>
                </div>
                <span class="text-indigo-500 text-xs font-bold bg-indigo-50 px-2 py-1 rounded-lg">Active</span>
              </div>
              <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Team Members</p>
              <h3 class="text-3xl font-black text-slate-800">{{ members.length }}</h3>
            </div>

            <div class="stats-card">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <i class="fas fa-paper-plane text-xl"></i>
                </div>
                <span class="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">New</span>
              </div>
              <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Pending Enquiries</p>
              <h3 class="text-3xl font-black text-slate-800">{{ enquiries.length }}</h3>
            </div>
          </div>

          <!-- TAB CONTENT: EVENTS -->
          <div *ngIf="currentTab === 'events'" class="space-y-10 animate-fade-in">
            <!-- Form Section -->
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h2 class="text-xl font-black text-slate-800">{{ isEditMode ? 'Edit Event' : 'Add New Event' }}</h2>
                <button *ngIf="isEditMode" (click)="cancelEdit()" class="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">Cancel Edit</button>
              </div>
              <form (ngSubmit)="saveEvent()" class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="input-label">Event Title</label>
                  <input type="text" [(ngModel)]="newEvent.title" name="title" class="admin-input" placeholder="Enter event name">
                </div>
                <div class="space-y-2">
                  <label class="input-label">Event Category</label>
                  <select [(ngModel)]="newEvent.type" name="type" class="admin-input">
                    <option value="Major Event">Major Event</option>
                    <option value="Training">Training</option>
                    <option value="Community">Community</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div class="space-y-2 text-secondary">
                  <label class="input-label">Date</label>
                  <input type="date" [(ngModel)]="newEvent.date" name="date" class="admin-input">
                </div>
                <div class="space-y-2">
                  <label class="input-label">Time & Location</label>
                  <div class="grid grid-cols-2 gap-4">
                    <input type="text" [(ngModel)]="newEvent.time" name="time" class="admin-input" placeholder="10:00 AM">
                    <input type="text" [(ngModel)]="newEvent.location" name="location" class="admin-input" placeholder="Salem, TN">
                  </div>
                </div>
                <div class="col-span-full space-y-2">
                  <label class="input-label">Featured Image URL</label>
                  <input type="text" [(ngModel)]="newEvent.image" name="image" class="admin-input" placeholder="https://...">
                </div>
                <div class="col-span-full space-y-2">
                  <label class="input-label">Event Description</label>
                  <textarea [(ngModel)]="newEvent.description" name="description" rows="3" class="admin-input" placeholder="Provide details..."></textarea>
                </div>
                <div class="col-span-full flex justify-end pt-4">
                  <button type="submit" class="bg-primary text-white px-10 py-4 rounded-xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    {{ isEditMode ? 'Update Changes' : 'Publish Event' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- List Section -->
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h2 class="text-xl font-black text-slate-800">Event Management</h2>
                <div class="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl">
                  <i class="fas fa-search text-slate-400 text-xs"></i>
                  <input type="text" placeholder="Search events..." class="bg-transparent border-none outline-none text-xs font-bold text-slate-600">
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead>
                    <tr class="bg-slate-50/50">
                      <th class="px-8 py-4 th-label">Event</th>
                      <th class="px-6 py-4 th-label">Schedule</th>
                      <th class="px-6 py-4 th-label">Category</th>
                      <th class="px-8 py-4 th-label text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr *ngFor="let event of events" class="hover:bg-slate-50/30 transition-colors">
                      <td class="px-8 py-5">
                        <div class="flex items-center space-x-4">
                          <div class="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                            <img [src]="event.image" class="w-full h-full object-cover">
                          </div>
                          <div>
                            <p class="font-bold text-slate-800 leading-tight">{{ event.title }}</p>
                            <p class="text-[10px] text-slate-400 font-bold uppercase mt-1">{{ event.location }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-5">
                        <p class="text-xs font-black text-slate-700">{{ event.date | date:'mediumDate' }}</p>
                        <p class="text-[10px] text-primary font-bold uppercase mt-0.5">{{ event.time }}</p>
                      </td>
                      <td class="px-6 py-5">
                        <span class="category-pill">{{ event.type }}</span>
                      </td>
                      <td class="px-8 py-5 text-right">
                        <div class="flex justify-end space-x-2">
                          <button (click)="startEdit(event)" class="action-btn text-blue-500 bg-blue-50"><i class="fas fa-pen text-[10px]"></i></button>
                          <button (click)="deleteEvent(event._id!)" class="action-btn text-red-500 bg-red-50"><i class="fas fa-trash text-[10px]"></i></button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- TAB CONTENT: TEAM -->
          <div *ngIf="currentTab === 'team'" class="space-y-10 animate-fade-in">
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h2 class="text-xl font-black text-slate-800">{{ isEditMemberMode ? 'Edit Member' : 'Add Team Member' }}</h2>
                <button *ngIf="isEditMemberMode" (click)="cancelMemberEdit()" class="text-xs font-bold text-slate-400 uppercase tracking-widest">Cancel</button>
              </div>
              <form (ngSubmit)="saveMember()" class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="input-label">Full Name</label>
                  <input type="text" [(ngModel)]="newMember.name" name="name" class="admin-input" placeholder="e.g. John Doe">
                </div>
                <div class="space-y-2">
                  <label class="input-label">Role / Ranking</label>
                  <select [(ngModel)]="newMember.role" name="role" class="admin-input">
                    <option value="Advisor">1. Advisor</option>
                    <option value="Chairman">2. Chairman</option>
                    <option value="Event Manager">3. Event Manager</option>
                    <option value="Finance">4. Finance</option>
                    <option value="Sponsorship">5. Sponsorship</option>
                    <option value="Marketing & Promotion">6. Marketing & Promotion</option>
                    <option value="Food & Beverage">7. Food & Beverage</option>
                    <option value="Member">8. Member</option>
                  </select>
                </div>
                <div class="col-span-full space-y-2">
                  <label class="input-label">Profile Bio</label>
                  <textarea [(ngModel)]="newMember.bio" name="bio" rows="2" class="admin-input" placeholder="Short description..."></textarea>
                </div>
                <div class="space-y-2">
                  <label class="input-label">Photo URL</label>
                  <input type="text" [(ngModel)]="newMember.image" name="image" class="admin-input" placeholder="https://...">
                </div>
                <div class="space-y-2">
                  <label class="input-label">Display Order</label>
                  <input type="number" [(ngModel)]="newMember.order" name="order" class="admin-input" placeholder="1, 2, 3...">
                </div>
                <div class="col-span-full flex justify-end pt-4">
                  <button type="submit" class="bg-primary text-white px-10 py-4 rounded-xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    {{ isEditMemberMode ? 'Update Member' : 'Add to Team' }}
                  </button>
                </div>
              </form>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div *ngFor="let member of members" class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative group hover:border-primary/30 transition-all">
                <div class="flex items-center space-x-4 mb-6">
                  <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-white ring-2 ring-slate-50 flex-shrink-0 shadow-md">
                    <img [src]="member.image" class="w-full h-full object-cover">
                  </div>
                  <div>
                    <h4 class="font-black text-slate-800 leading-tight">{{ member.name }}</h4>
                    <p class="text-xs font-bold text-primary uppercase tracking-wider mt-1">{{ member.role }}</p>
                  </div>
                </div>
                <p class="text-xs text-slate-500 font-medium line-clamp-2 italic mb-6">"{{ member.bio }}"</p>
                <div class="flex items-center justify-between border-t border-slate-50 pt-4">
                  <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Priority: {{ member.order }}</span>
                  <div class="flex space-x-2">
                    <button (click)="startMemberEdit(member)" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"><i class="fas fa-edit text-xs"></i></button>
                    <button (click)="deleteMember(member._id!)" class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><i class="fas fa-trash text-xs"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB CONTENT: INQUIRIES -->
          <div *ngIf="currentTab === 'enquiries'" class="animate-fade-in">
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="px-8 py-6 border-b border-slate-100">
                <h2 class="text-xl font-black text-slate-800">Recent User Enquiries</h2>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead>
                    <tr class="bg-slate-50/50">
                      <th class="px-8 py-4 th-label">User Details</th>
                      <th class="px-6 py-4 th-label">Message</th>
                      <th class="px-6 py-4 th-label text-center">Date</th>
                      <th class="px-8 py-4 th-label text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr *ngFor="let eq of enquiries" class="hover:bg-slate-50/30 transition-colors">
                      <td class="px-8 py-6">
                        <div>
                          <p class="font-black text-slate-800 leading-none mb-1">{{ eq.name }}</p>
                          <p class="text-xs text-slate-400 font-bold">{{ eq.email }}</p>
                          <div class="flex items-center space-x-2 mt-2">
                            <span class="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{{ eq.location }}</span>
                            <span class="text-[9px] text-primary font-black"><i class="fas fa-phone mr-1"></i>{{ eq.phone }}</span>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-6">
                        <div class="max-w-xs">
                          <p class="text-xs text-slate-600 leading-relaxed italic line-clamp-3">"{{ eq.message }}"</p>
                        </div>
                      </td>
                      <td class="px-6 py-6 text-center">
                        <p class="text-xs font-black text-slate-700">{{ eq.createdAt | date:'shortDate' }}</p>
                        <p class="text-[10px] text-slate-400 font-bold mt-0.5">{{ eq.createdAt | date:'shortTime' }}</p>
                      </td>
                      <td class="px-8 py-6 text-right">
                        <button (click)="deleteEnquiry(eq._id!)" class="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center ml-auto">
                          <i class="fas fa-trash-alt text-xs"></i>
                        </button>
                      </td>
                    </tr>
                    <tr *ngIf="enquiries.length === 0">
                      <td colspan="4" class="py-20 text-center opacity-30">
                        <i class="fas fa-inbox text-5xl mb-4"></i>
                        <p class="font-black uppercase tracking-widest text-sm">Inbox is empty</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .nav-item {
      @apply flex items-center space-x-4 w-full px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800/50;
    }
    .active-nav {
      @apply bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary;
    }
    .stats-card {
      @apply bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300;
    }
    .input-label {
      @apply block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1;
    }
    .admin-input {
      @apply w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-300;
    }
    .th-label {
      @apply text-[10px] font-black uppercase text-slate-400 tracking-widest;
    }
    .category-pill {
      @apply px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200;
    }
    .action-btn {
      @apply w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95;
    }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminComponent implements OnInit {
  currentTab: 'events' | 'team' | 'enquiries' = 'events';

  // Events
  events: Event[] = [];
  isEditMode = false;
  editingId: string | null = null;
  newEvent: Event = {
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    type: 'Major Event',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'
  };

  // Team
  members: TeamMember[] = [];
  isEditMemberMode = false;
  editingMemberId: string | null = null;
  newMember: TeamMember = {
    name: '',
    role: '',
    bio: '',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
    order: 0
  };

  // Enquiries
  enquiries: Enquiry[] = [];

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit() {
    this.loadEvents();
    this.loadMembers();
    this.loadEnquiries();
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('admin_logged_in');
    }
    this.router.navigate(['/admin/login']);
  }

  // --- EVENT METHODS ---
  loadEvents() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  saveEvent() {
    if (this.isEditMode && this.editingId) {
      this.eventService.updateEvent(this.editingId, this.newEvent).subscribe({
        next: () => {
          alert('Event updated successfully!');
          this.resetForm();
          this.loadEvents();
        },
        error: (err) => alert('Error updating event')
      });
    } else {
      this.eventService.addEvent(this.newEvent).subscribe({
        next: () => {
          alert('Event published successfully!');
          this.resetForm();
          this.loadEvents();
        },
        error: (err) => alert('Error creating event')
      });
    }
  }

  startEdit(event: Event) {
    this.isEditMode = true;
    this.editingId = event._id!;
    this.newEvent = { ...event };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.resetForm();
  }

  deleteEvent(id: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          alert('Event deleted!');
          this.loadEvents();
        },
        error: (err) => alert('Error deleting event')
      });
    }
  }

  private resetForm() {
    this.isEditMode = false;
    this.editingId = null;
    this.newEvent = {
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      type: 'Major Event',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'
    };
  }

  // --- TEAM METHODS ---
  loadMembers() {
    this.eventService.getMembers().subscribe(members => {
      this.members = members;
    });
  }

  saveMember() {
    if (this.isEditMemberMode && this.editingMemberId) {
      this.eventService.updateMember(this.editingMemberId, this.newMember).subscribe({
        next: () => {
          alert('Member updated successfully!');
          this.resetMemberForm();
          this.loadMembers();
        },
        error: (err) => alert('Error updating member')
      });
    } else {
      this.eventService.addMember(this.newMember).subscribe({
        next: () => {
          alert('Team member added successfully!');
          this.resetMemberForm();
          this.loadMembers();
        },
        error: (err) => alert('Error adding member')
      });
    }
  }

  startMemberEdit(member: TeamMember) {
    this.isEditMemberMode = true;
    this.editingMemberId = member._id!;
    this.newMember = { ...member };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelMemberEdit() {
    this.resetMemberForm();
  }

  deleteMember(id: string) {
    if (confirm('Are you sure you want to delete this team member?')) {
      this.eventService.deleteMember(id).subscribe({
        next: () => {
          alert('Member deleted!');
          this.loadMembers();
        },
        error: (err) => alert('Error deleting member')
      });
    }
  }

  private resetMemberForm() {
    this.isEditMemberMode = false;
    this.editingMemberId = null;
    this.newMember = {
      name: '',
      role: '',
      bio: '',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
      order: 0
    };
  }

  // --- ENQUIRY METHODS ---
  loadEnquiries() {
    this.eventService.getEnquiries().subscribe(data => {
      this.enquiries = data;
    });
  }

  deleteEnquiry(id: string) {
    if (confirm('Delete this lead?')) {
      this.eventService.deleteEnquiry(id).subscribe({
        next: () => {
          alert('Lead deleted');
          this.loadEnquiries();
        },
        error: (err) => alert('Error deleting lead')
      });
    }
  }
}
