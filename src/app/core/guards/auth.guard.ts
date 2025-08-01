import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { jwtDecode } from "jwt-decode";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // ⚠️ Khi chạy SSR (không có window) → bỏ qua kiểm tra storage
  const isBrowser = typeof window !== "undefined";
  if (!isBrowser) {
    // Cho SSR tiếp tục; bạn có thể return false để chặn nếu muốn
    return true;
  }

  // ───────────────────────────────────────────────────────────
  // Các thao tác chỉ thực thi ở phía client (trình duyệt)
  const token = sessionStorage.getItem("token");
  const userJson = sessionStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const allowedRoles = (route.data?.["roles"] as string[]) ?? [];

  // 1. Chưa đăng nhập
  if (!token || !user?.role) {
    return router.createUrlTree(["/sign-in"]);
  }

  // 2. Token hết hạn
  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      sessionStorage.removeItem("token");
      return router.createUrlTree(["/sign-in"]);
    }
  } catch {
    // Token lỗi
    sessionStorage.removeItem("token");
    return router.createUrlTree(["/sign-in"]);
  }

  // 3. Kiểm tra quyền
  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return true;
  }

  // 4. Không đủ quyền
  return router.createUrlTree(["/"]);
};
