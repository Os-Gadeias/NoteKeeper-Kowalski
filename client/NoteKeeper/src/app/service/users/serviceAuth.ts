import { inject, Injectable } from '@angular/core';
import { URL_API } from '../../auth/auth.tokens';
import { Observable } from 'rxjs';
import { CreateUserRequest, CreateUserResponse, LoginRequest, LoginResponse } from './models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ServiceAuth {
  private readonly urlApi = inject(URL_API);

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.urlApi}/auth/login`, loginRequest);
  }

  register(createUser: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(`${this.urlApi}/auth/cadastro`, createUser);
  }

  logout() {
    return this.http.post(`${this.urlApi}/auth/logout`, '');
  }
}
