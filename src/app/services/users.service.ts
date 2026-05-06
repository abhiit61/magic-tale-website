import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../api-endpoints.config';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly base = `${API_BASE_URL}${API_ENDPOINTS.admin.users}`;

  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.base);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`);
  }

  deactivateUser(id: string): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}/deactivate`, {});
  }

  updateUserRole(id: string, role: 'ADMIN' | 'USER'): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}/role`, { role });
  }
}
