import { Component, inject, input, signal } from '@angular/core';
import { ServiceNotes } from '../../../service/notes/serviceNotes';
import { Router, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { extractApiError } from '../../../../api/extractApiError';

@Component({
  selector: 'app-deleteNote',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './deleteNote.html',
})
export class DeleteNote {
  private readonly serviceNotes = inject(ServiceNotes);
  private readonly router = inject(Router);

  protected errorMessage = signal<string | null>(null);

  readonly id = input.required<string>();

  protected readonly note = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.serviceNotes.getById(id))),
    {
      initialValue: null,
    },
  );

  deleteNote(event: Event) {
    event.preventDefault();
    this.errorMessage.set(null);

    this.serviceNotes.delete(this.id()).subscribe({
      next: () => {
        this.router.navigate(['/notes']);
      },
      error: (erro: HttpErrorResponse) => {
        this.errorMessage.set(extractApiError(erro));
      },
    });
  }
}
