import { Injectable, inject } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly USER_KEY = "currentUser";

  constructor() {}

  // Kiểm tra đang ở trình duyệt
  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  getCurrentUser(): any {
    if (!this.isBrowser()) return null;

    const userJson = sessionStorage.getItem(this.USER_KEY);
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      console.error("Lỗi khi parse currentUser:", e);
      return null;
    }
  }

  setCurrentUser(user: any): void {
    if (this.isBrowser()) {
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  clearCurrentUser(): void {
    if (this.isBrowser()) {
      sessionStorage.removeItem(this.USER_KEY);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}
