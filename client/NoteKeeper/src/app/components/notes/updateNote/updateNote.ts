import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { ServiceNotes } from '../../../service/notes/serviceNotes';
import { Router, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { ServiceCategories } from '../../../service/categories/serviceCategories';
import { ListCategoriesResponse } from '../../../service/categories/models';
import { toViewModelCategory } from '../../util';
import { HttpErrorResponse } from '@angular/common/http';
import { extractApiError } from '../../../../api/extractApiError';

interface UpdateNoteViewModel {
  titulo: string;
  descricao: string;
  categorias: string[];
  status: string;
}

@Component({
  selector: 'app-deleteNote',
  standalone: true,
  imports: [DatePipe, RouterLink, FormField],
  templateUrl: './updateNote.html',
})
export class UpdateNote {
  private readonly serviceNotes = inject(ServiceNotes);
  private readonly serviceCategories = inject(ServiceCategories);

  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const note = this.note();

      if (!note) return;

      untracked(() => {
        this.modelForm.set({
          titulo: note.titulo,
          descricao: note.descricao,
          categorias: note.categorias.map((category) => category.id),
          status: note.status,
        });
      });
    });
  }

  protected errorMessage = signal<string | null>(null);

  readonly id = input.required<string>();

  protected readonly modelForm = signal<UpdateNoteViewModel>({
    titulo: '',
    descricao: '',
    categorias: [],
    status: '',
  });

  protected readonly updateNoteForm = form(this.modelForm, (model) => {
    required(model.titulo, { message: 'Title is required.' });
    minLength(model.titulo, 2, { message: 'Title must be between 2 and 100 characters.' });
    maxLength(model.titulo, 100, { message: 'Title must be between 2 and 100 characters.' });
    required(model.descricao, { message: 'Description is required.' });
    maxLength(model.descricao, 300, { message: 'Description must have at most 300 characters.' });
  });

  protected readonly isSaving = signal(false);

  protected readonly note = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.serviceNotes.getById(id))),
    {
      initialValue: null,
    },
  );

  protected readonly categories = toSignal(
    this.serviceCategories
      .list()
      .pipe(map((list: ListCategoriesResponse[]) => toViewModelCategory(list))),
  );

  protected toggleCategory(id: string): void {
    this.updateNoteForm
      .categorias()
      .value.update((categorias) =>
        categorias.includes(id)
          ? categorias.filter((categoryId) => categoryId !== id)
          : [...categorias, id],
      );
  }
  protected updateNote(event: Event) {
    event.preventDefault();

    this.errorMessage.set(null);

    if (!this.updateNoteForm().valid()) {
      this.updateNoteForm.titulo().markAsTouched();
      this.updateNoteForm.descricao().markAsTouched();
      return;
    }

    const data = {
      titulo: this.modelForm().titulo.trim(),
      descricao: this.modelForm().descricao.trim(),
      categoriaIds: this.modelForm().categorias,
      status: this.modelForm().status,
    };

    this.serviceNotes.update(this.id(), data).subscribe({
      next: () => {
        this.router.navigate(['notes']);
      },
      error: (erro: HttpErrorResponse) => {
        this.errorMessage.set(extractApiError(erro));
      },
    });
  }
}
