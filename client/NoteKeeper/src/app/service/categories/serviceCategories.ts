import { inject, Injectable } from '@angular/core';
import { RegisterCategoryRequest, RegisterCategoryResponse } from './models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { URL_API } from '../../auth/auth.tokens';

Injectable({
  providedIn: 'root',
});

export class ServiceCategories {
  private readonly urlApi = inject(URL_API);

  constructor(protected http: HttpClient) {}

  register(req: RegisterCategoryRequest): Observable<RegisterCategoryResponse> {
    return this.http.post<RegisterCategoryResponse>(`${this.urlApi}/categorias`, req);
  }
}
