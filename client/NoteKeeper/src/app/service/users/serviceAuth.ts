import { effect, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  private readonly router = inject(Router);
  private temporizadorExpiracao?: ReturnType<typeof setTimeout>;

  constructor(
    private http: HttpClient,
    private serviceStorage: ServiceStorage,
  ) {
    // Verifica o token salvo ao iniciar e sempre que ele mudar, inclusive depois do login.
    effect((onCleanup) => {
      this.verificarExpiracaoToken();

      // Cancela a verificacao anterior quando o token mudar ou o servico for destruido.
      onCleanup(() => clearTimeout(this.temporizadorExpiracao));
    });
  }

  verificarExpiracaoToken(): void {
    // Cancela o agendamento anterior para nao manter dois temporizadores ativos.
    clearTimeout(this.temporizadorExpiracao);
    const token = this.serviceStorage.token();
    if (!token) return;

    let dataExpiracao: number;

    try {
      // Le o campo exp do JWT e converte os segundos em milissegundos.
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const dadosToken = JSON.parse(atob(payload));
      if (typeof dadosToken.exp !== 'number' || !Number.isFinite(dadosToken.exp)) {
        throw new Error('Token sem data de expiracao valida.');
      }
      dataExpiracao = dadosToken.exp * 1000;
    } catch {
      // Um token invalido tambem encerra a sessao, pois nao permite conferir a validade.
      this.logoutPorExpiracao();
      return;
    }

    const tempoRestante = dataExpiracao - Date.now();

    // Se ja venceu, remove a sessao imediatamente.
    if (tempoRestante <= 0) {
      this.logoutPorExpiracao();
      return;
    }

    // Agenda uma nova verificacao no vencimento, respeitando o limite do setTimeout.
    this.temporizadorExpiracao = setTimeout(() => {
      this.verificarExpiracaoToken();
    }, Math.min(tempoRestante, 2147483647));
  }

  private logoutPorExpiracao(): void {
    // Limpa o token e o nome localmente e redireciona para a tela de login.
    // Nao depende da API, pois o token expirado pode ser recusado por ela.
    this.serviceStorage.clear();
    void this.router.navigate(['/login']);
  }

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
