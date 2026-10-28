import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ServiceNotes } from '../../../service/notes/serviceNotes';
import { HttpErrorResponse } from '@angular/common/http';
import { extractApiError } from '../../../../api/extractApiError';
import { catchError, of, tap } from 'rxjs';

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

  protected readonly filteredNotes = computed(() => {
    const notes = this.notes();
    const status = this.selectedStatus();

    if (status === 'All') {
      return notes;
    }

    return notes.filter((note) => note.status === status);
  });
}
