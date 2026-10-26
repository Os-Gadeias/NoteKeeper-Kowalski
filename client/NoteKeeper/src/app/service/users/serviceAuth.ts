import { inject, Injectable } from '@angular/core';
import { URL_API } from '../../auth/auth.tokens';
import { Observable, tap } from 'rxjs';
import { CreateUserRequest, CreateUserResponse, LoginRequest, LoginResponse } from './models';
import { HttpClient } from '@angular/common/http';
import { ServiceStorage } from '../../auth/serviceStorage';

@Injectable({
  providedIn: 'root',
})
export class ServiceAuth {
  private readonly urlApi = inject(URL_API);

  constructor(
    private http: HttpClient,
    private serviceStorage: ServiceStorage,
  ) {}

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.urlApi}/auth/login`, loginRequest).pipe(
      tap((value) => {
        //tap nao muda o valor do retorno da funcao
        this.serviceStorage.saveAuth(value.accessToken, value.nome);
      }),
    );
  }

  register(createUser: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(`${this.urlApi}/auth/cadastro`, createUser);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.urlApi}/auth/logout`, {});
  }
}
