import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { ServiceNotes } from '../../../service/notes/serviceNotes';
import { extractApiError } from '../../../../api/extractApiError';

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
}
