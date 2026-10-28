import { inject, Injectable } from '@angular/core';
import { URL_API } from '../../auth/auth.tokens';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GetByIdNoteResponse,
  ListNotesResponse,
  RegisterNoteRequest,
  UpdateNoteRequest,
} from './models';

@Injectable({
  providedIn: 'root',
})
export class ServiceNotes {
  private urlApi = inject(URL_API);
  constructor(private http: HttpClient) {}

  list(): Observable<ListNotesResponse[]> {
    return this.http.get<ListNotesResponse[]>(`${this.urlApi}/notas`);
  }
  getById(id: string): Observable<GetByIdNoteResponse> {
    return this.http.get<GetByIdNoteResponse>(`${this.urlApi}/notas/${id}`);
  }
  register(request: RegisterNoteRequest) {
    return this.http.post(`${this.urlApi}/notas`, request);
  }
  delete(id: string) {
    return this.http.delete(`${this.urlApi}/notas/${id}`);
  }
  update(id: string, request: UpdateNoteRequest) {
    return this.http.put(`${this.urlApi}/notas/${id}`, request);
  }
}
