import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#f0f7ff] pt-32 pb-24 px-4 overflow-x-hidden">
      <div class="max-w-7xl mx-auto">
        
        <!-- EVENTS HEADER -->
        <div class="text-center mb-24 animate-fade-in">
          <span class="inline-block px-4 py-1.5 bg-blue-600/10 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-6">
            Event Calendar
          </span>
          <h1 class="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
            Live <span class="text-blue-600">Experiences</span>
          </h1>
          <p class="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Stay updated with our latest activities, leadership programs, and community initiatives. 
            Join us in creating positive change through our upcoming events.
          </p>
          <div class="w-32 h-1.5 bg-blue-600 mx-auto rounded-full shadow-lg shadow-blue-600/20 mt-10"></div>
        </div>

        <!-- EVENTS GRID -->
        <div *ngIf="events.length > 0; else noEvents" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
          @for (event of events; track event._id) {
            <div class="group bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500">
              <div class="relative h-72 overflow-hidden">
                <img [src]="event.image" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                <div class="absolute top-6 left-6 bg-blue-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{{ event.type }}</div>
              </div>
              <div class="p-10">
                <div class="flex items-center space-x-4 mb-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <span><i class="far fa-calendar-alt mr-2"></i>{{ event.date | date:'mediumDate' }}</span>
                  <span><i class="fas fa-map-marker-alt mr-2"></i>{{ event.location }}</span>
                </div>
                <h4 class="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">{{ event.title }}</h4>
                <p class="text-slate-500 text-sm leading-relaxed line-clamp-3">{{ event.description }}</p>
                
                <div class="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">{{ event.time }}</span>
                  <button class="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center group/btn">
                    Details <i class="fas fa-arrow-right ml-2 group-hover/btn:translate-x-1 transition-transform"></i>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <ng-template #noEvents>
          <div class="py-40 text-center">
            <div class="w-24 h-24 bg-white rounded-full shadow-inner flex items-center justify-center mx-auto mb-8 text-slate-200">
              <i class="fas fa-calendar-minus text-4xl"></i>
            </div>
            <h3 class="text-2xl font-black text-slate-400 uppercase tracking-widest">No events scheduled</h3>
            <p class="text-slate-300 mt-2 font-medium">Check back later for new updates!</p>
          </div>
        </ng-template>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 1s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class EventsComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe({
      next: (events) => { this.events = events; this.cdr.markForCheck(); }
    });
  }
}
