import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const allowedRoles = route.data?.['roles'] as string[] || [];

  if (!token || !user?.role) {
    console.log('Chưa đăng nhập hoặc thiếu role');
    return router.navigate(['/sign-in']);
  }

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log('Token hết hạn');
      sessionStorage.removeItem('token');
      return router.navigate(['/sign-in']);
    }

    if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
      return true;
    } else {
      console.log('Không có quyền truy cập');
      return router.navigate(['/']);
    }
  } catch (err) {
    console.log('Token lỗi');
    sessionStorage.removeItem('token');
    return router.navigate(['/sign-in']);
  }
};
