import { inject, Injectable } from '@angular/core';
import { URL_API } from '../../auth/auth.tokens';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetByIdNoteResponse, ListNotesResponse, RegisterNoteRequest } from './models';

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
}
