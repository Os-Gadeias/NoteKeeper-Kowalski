import { inject, Injectable } from '@angular/core';
import { URL_API } from '../../auth/auth.tokens';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListNotesResponse } from './models';

@Injectable({
  providedIn: 'root',
})
export class ServiceNotes {
  private urlApi = inject(URL_API);
  constructor(private http: HttpClient) {}

  list(): Observable<ListNotesResponse[]> {
    return this.http.get<ListNotesResponse[]>(`${this.urlApi}/notas`);
  }
}
