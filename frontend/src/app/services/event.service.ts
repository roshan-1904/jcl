import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Event {
  _id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: string;
  image: string;
  createdAt?: Date;
}

export interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order: number;
  createdAt?: Date;
}

export interface Enquiry {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  message: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Events
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events`);
  }

  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/events`, event);
  }

  updateEvent(id: string, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/events/${id}`, event);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/events/${id}`);
  }

  // Team Members
  getMembers(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.apiUrl}/members`);
  }

  addMember(member: TeamMember): Observable<TeamMember> {
    return this.http.post<TeamMember>(`${this.apiUrl}/members`, member);
  }

  updateMember(id: string, member: TeamMember): Observable<TeamMember> {
    return this.http.put<TeamMember>(`${this.apiUrl}/members/${id}`, member);
  }

  deleteMember(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/members/${id}`);
  }

  // Enquiries
  getEnquiries(): Observable<Enquiry[]> {
    return this.http.get<Enquiry[]>(`${this.apiUrl}/enquiries`);
  }

  addEnquiry(enquiry: Enquiry): Observable<Enquiry> {
    return this.http.post<Enquiry>(`${this.apiUrl}/enquiries`, enquiry);
  }

  deleteEnquiry(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/enquiries/${id}`);
  }
}
