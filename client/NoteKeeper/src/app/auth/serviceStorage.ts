import { Injectable, signal } from '@angular/core';

type AuthStorageKey = 'token' | 'username';

@Injectable({
  providedIn: 'root',
})

export class ServiceStorage {
  private readonly _token = signal<string | null>(null);
  private readonly _username = signal<string | null>(null);

  readonly token = this._token.asReadonly();
  readonly username = this._username.asReadonly();

  constructor() {
    if (typeof window !== 'undefined') {
      this._token.set(this.get('token'));
      this._username.set(this.get('username'));
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('username');
    }
  }

  save(chave: AuthStorageKey, valor: string): void {
    const valorNormalizado = valor.trim();
    if (!valorNormalizado || (chave === 'token' && valorNormalizado !== valor)) {
      throw new TypeError(`O valor de "${chave}" é inválido.`);
    }

    this.getStorage().setItem(chave, valorNormalizado);
    this.updateState(chave, valorNormalizado);
  }

  get(chave: AuthStorageKey): string | null {
    const valor = this.getStorage().getItem(chave);
    if (chave === 'token' && valor !== null && (!valor.trim() || valor !== valor.trim())) {
      this.remove(chave);
      return null;
    }

    return valor;
  }

  remove(chave: AuthStorageKey): void {
    this.getStorage().removeItem(chave);
    this.updateState(chave, null);
  }

  private updateState(chave: AuthStorageKey, valor: string | null): void {
    if (chave === 'token') {
      this._token.set(valor);
    } else {
      this._username.set(valor);
    }
  }

  clear(): void {
    this.remove('token');
    this.remove('username');
  }

  private getStorage(): Storage {
    if (typeof window === 'undefined') {
      throw new Error('O armazenamento de sessão só está disponível no navegador.');
    }

    return window.sessionStorage;
  }
  saveAuth(token: string, username: string): void {
    this.save('token', token);
    this.save('username', username);
  }
}
