import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { supabase } from '../supabase';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);

  try {
    const { data } = await supabase.auth.getSession();
    if (data.session) return true;
    router.navigate(['/login']);
    return false;
  } catch (e) {
    router.navigate(['/login']);
    return false;
  }
};