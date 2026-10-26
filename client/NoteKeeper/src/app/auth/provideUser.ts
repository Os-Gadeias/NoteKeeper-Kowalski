import { computed, inject, Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { ServiceStorage } from './serviceStorage';
import { ServiceAuth } from '../service/users/serviceAuth';

@Injectable({
  providedIn: 'root',
})
export class ProvideUser {
  private readonly storage = inject(ServiceStorage);
  private readonly router = inject(Router);

  constructor(protected serviceAuth: ServiceAuth) {}

  readonly username = this.storage.username;

  readonly isLoggedIn = computed(
    () => this.username() !== null && this.storage.token() !== null,
  );

  login(token: string, username: string): void {
    this.storage.saveAuth(token, username);
  }

  logout(): void {
    this.serviceAuth
      .logout()
      .pipe(finalize(() => this.finalizarLogoutLocal()))
      .subscribe({
        error: (erro: unknown) => {
          console.error('Falha ao notificar a API sobre o logout.', erro);
        },
      });
  }

  private finalizarLogoutLocal(): void {
    this.storage.clear();
    void this.router.navigate(['/login']);
  }
}
