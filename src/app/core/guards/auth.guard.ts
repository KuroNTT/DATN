import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { jwtDecode } from "jwt-decode";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

   const isBrowser = typeof window !== "undefined" && typeof sessionStorage !== "undefined";
  if (!isBrowser) return true; 

  const token = sessionStorage.getItem("token");
  if (!token) {
    return router.createUrlTree(["/sign-in"]);
  }

  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      sessionStorage.clear();
      return router.createUrlTree(["/sign-in"]);
    }

    // Nếu user trong storage chưa có, tạo mới từ token
    let userJson = sessionStorage.getItem("user");
    let user = userJson ? JSON.parse(userJson) : null;

    if (!user) {
      user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role , 
      };
      sessionStorage.setItem("user", JSON.stringify(user));
    }

    const allowedRoles = (route.data?.["roles"] as string[]) ?? [];
    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      return router.createUrlTree(["/"]);
    }

    return true;
  } catch {
    sessionStorage.clear();
    return router.createUrlTree(["/sign-in"]);
  }
};
