import { inject, Injectable } from '@angular/core';
import { URL_API } from '../../auth/auth.tokens';
import { Observable, switchMap, tap } from 'rxjs';
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

  //faz o registro do usuario e se acaso for sucedido, chama o metodo login e passa os parametros agora cadastrados pra ele
  register(createUser: CreateUserRequest): Observable<LoginResponse> {
    return this.http.post<CreateUserResponse>(`${this.urlApi}/auth/cadastro`, createUser).pipe(
      switchMap(() => {
        return this.login({
          email: createUser.email,
          senha: createUser.senha,
        });
      }),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.urlApi}/auth/logout`, {});
  }
}
