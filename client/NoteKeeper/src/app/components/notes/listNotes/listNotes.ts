import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ServiceNotes } from '../../../service/notes/serviceNotes';
import { HttpErrorResponse } from '@angular/common/http';
import { extractApiError } from '../../../../api/extractApiError';
import { catchError, map, of, tap } from 'rxjs';
import { BaseNgValidationError } from '@angular/forms/signals';
import { ListCategoriesResponse } from '../../../service/categories/models';
import { toViewModelCategory } from '../../util';
import { ServiceCategories } from '../../../service/categories/serviceCategories';

@Component({
  selector: 'app-ListNotes',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './listNotes.html',
})
export class ListNotes {
  private readonly serviceNotes = inject(ServiceNotes);
  private readonly serviceCategories = inject(ServiceCategories);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly selectByCategory = signal('');

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

  protected readonly categories = toSignal(
    this.serviceCategories
      .list()
      .pipe(map((list: ListCategoriesResponse[]) => toViewModelCategory(list))),
  );

  //computed é um metodo na qual quando qualquer signal dentro dele tem o valor alterado, ele chama a funcao
  protected readonly filteredNotes = computed(() => {
    const notes = this.notes();
    const status = this.selectedStatus();
    const name = this.searchTerm();
    const categorySelectedId = this.selectByCategory();

    return notes.filter((note) => {
      const matchesName = note.titulo.toLowerCase().includes(name);

      const matchesStatus = status === 'All' || note.status === status;

      const matchesCategory =
        categorySelectedId === '' ||
        note.categorias.some((category) => category.id === categorySelectedId);

      return matchesName && matchesStatus && matchesCategory;
    });
  });
}
