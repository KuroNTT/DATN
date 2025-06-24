import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode'
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = sessionStorage.getItem('token')
  if (!token) {
    console.log("Không có token");
    return router.navigate(['/sign-in'])
  }
  try {
    const decoded: any = jwtDecode(token);
    const currenttime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currenttime) {
      console.log("Token quá hạn");
      localStorage.removeItem('token');
      return router.navigate(['/sign-in'])
    } else return true;
  } catch (error) {
    console.log("Lõi khi dò token");
    localStorage.removeItem('token');
    return router.navigate(['/sign-in'])
  }



};
