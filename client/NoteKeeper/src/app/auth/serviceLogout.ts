import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_API } from './auth.tokens';

@Injectable({ providedIn: 'root' })
export class ServiceLogout {
  private readonly apiUrl = URL_API.toString();

  constructor(private http: HttpClient) {}

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout}`, {});
  }
}
