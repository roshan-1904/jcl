import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'events', loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent) },
  { path: 'portfolio', loadComponent: () => import('./pages/portfolio/portfolio.component').then(m => m.PortfolioComponent) },
  { path: 'members', loadComponent: () => import('./pages/members/members.component').then(m => m.MembersComponent) },
  { path: 'legacy', loadComponent: () => import('./pages/legacy/legacy.component').then(m => m.LegacyComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { 
    path: 'admin', 
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', loadComponent: () => import('./pages/admin/admin-login.component').then(m => m.AdminLoginComponent) },
      { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
