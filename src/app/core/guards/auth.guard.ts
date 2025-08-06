import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { jwtDecode } from "jwt-decode";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isBrowser = typeof window !== "undefined";
  if (!isBrowser) {
    return true;
  }

  const token = sessionStorage.getItem("token");
  const userJson = sessionStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const allowedRoles = (route.data?.["roles"] as string[]) ?? [];

  if (!token || !user?.role) {
    return router.createUrlTree(["/sign-in"]);
  }

  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      sessionStorage.removeItem("token");
      return router.createUrlTree(["/sign-in"]);
    }
  } catch {
    sessionStorage.removeItem("token");
    return router.createUrlTree(["/sign-in"]);
  }

  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return true;
  }

  return router.createUrlTree(["/"]);
};
