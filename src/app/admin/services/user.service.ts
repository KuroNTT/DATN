import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/admin/user`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  softDeleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  toggleLockUser(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/lock`, {});
  }
  changeUserRole(id: number, role: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/role`, { role });
  }
  resendVerify(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/resend-verify`, { email });
  }
}
