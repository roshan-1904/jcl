import axios from 'axios';

// Vite defines import.meta.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

const api = axios.create({
  baseURL: API_URL,
});

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

export interface President {
  _id?: string;
  name: string;
  year: string;
  image: string;
  createdAt?: Date;
}

export interface LegacyImage {
  _id?: string;
  image: string;
  title?: string;
  createdAt?: Date;
}

export interface AboutContent {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  updatedAt?: Date;
}

const eventService = {
  login: (credentials: any) => api.post('/login', credentials),

  // About Content
  getAboutContent: () => api.get<AboutContent>('/about-content'),
  updateAboutContent: (content: AboutContent) => api.put<AboutContent>('/about-content', content),

  // Events
  getEvents: () => api.get<Event[]>('/events'),
  addEvent: (event: Event) => api.post<Event>('/events', event),
  updateEvent: (id: string, event: Event) => api.put<Event>(`/events/${id}`, event),
  deleteEvent: (id: string) => api.delete(`/events/${id}`),

  // Team Members
  getMembers: () => api.get<TeamMember[]>('/members'),
  addMember: (member: TeamMember) => api.post<TeamMember>('/members', member),
  updateMember: (id: string, member: TeamMember) => api.put<TeamMember>(`/members/${id}`, member),
  deleteMember: (id: string) => api.delete(`/members/${id}`),

  // Enquiries
  getEnquiries: () => api.get<Enquiry[]>('/enquiries'),
  addEnquiry: (enquiry: Enquiry) => api.post<Enquiry>('/enquiries', enquiry),
  deleteEnquiry: (id: string) => api.delete(`/enquiries/${id}`),

  // Presidents
  getPresidents: () => api.get<President[]>('/presidents'),
  addPresident: (president: President) => api.post<President>('/presidents', president),
  updatePresident: (id: string, president: President) => api.put<President>(`/presidents/${id}`, president),
  deletePresident: (id: string) => api.delete(`/presidents/${id}`),

  // Legacy Images
  getLegacyImages: () => api.get<LegacyImage[]>('/legacy-images'),
  addLegacyImage: (image: LegacyImage) => api.post<LegacyImage>('/legacy-images', image),
  deleteLegacyImage: (id: string) => api.delete(`/legacy-images/${id}`),
};

export { eventService };
export default api;
