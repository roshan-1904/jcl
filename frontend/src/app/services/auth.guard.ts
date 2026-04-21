import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  
  if (typeof localStorage !== 'undefined') {
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    if (isLoggedIn) {
      return true;
    }
  }
  
  return router.parseUrl('/admin/login');
};
