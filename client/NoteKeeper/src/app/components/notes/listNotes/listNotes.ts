import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ServiceNotes } from '../../../service/notes/serviceNotes';
import { HttpErrorResponse } from '@angular/common/http';
import { extractApiError } from '../../../../api/extractApiError';
import { catchError, of, tap } from 'rxjs';
import { BaseNgValidationError } from '@angular/forms/signals';

@Component({
  selector: 'app-ListNotes',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './listNotes.html',
})
export class ListNotes {
  private readonly serviceNotes = inject(ServiceNotes);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly searchTerm = signal('');

  protected readonly selectedStatus = signal<'All' | 'Ativa' | 'Arquivada'>('All');

  protected readonly notes = toSignal(
    this.serviceNotes.list().pipe(
      tap(() => this.isLoading.set(false)),
      catchError((error: HttpErrorResponse) => {
        this.errorMessage.set(extractApiError(error));
        this.isLoading.set(false);
        return of([]);
      }),
    ),
    { initialValue: [] },
  );

  //computed é um metodo na qual quando qualquer signal dentro dele tem o valor alterado, ele chama a funcao
  protected readonly filteredNotes = computed(() => {
    const notes = this.notes();
    const status = this.selectedStatus();
    const name = this.searchTerm();

    if (status === 'All') {
      return notes.filter((note) => note.titulo.toLowerCase().includes(name.toLowerCase()));
    }

    return notes
      .filter((note) => note.titulo.toLowerCase().includes(name.toLowerCase()))
      .filter((note) => note.status === status);
  });
}
