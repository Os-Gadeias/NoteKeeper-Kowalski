import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { ServiceNotes } from '../../../service/notes/serviceNotes';
import { Router, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { form, FormField, required } from '@angular/forms/signals';
import { ServiceCategories } from '../../../service/categories/serviceCategories';
import { ListCategoriesResponse } from '../../../service/categories/models';
import { toViewModelCategory } from '../../util';

interface UpdateNoteViewModel {
  titulo: string;
  descricao: string;
  categorias: string[];
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
  });

  protected readonly updateNoteForm = form(this.modelForm, (model) => {
    required(model.titulo, { message: 'The title is required' });
    required(model.descricao, { message: 'The description is required' });
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
  protected updateNote(event: Event) {}
}
