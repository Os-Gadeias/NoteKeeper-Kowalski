import { Component, computed, inject, signal } from '@angular/core';
import { ServiceNotes } from '../../../service/notes/serviceNotes';
import { ServiceCategories } from '../../../service/categories/serviceCategories';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ListCategoriesResponse } from '../../../service/categories/models';
import { toViewModelCategory } from '../../util';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { extractApiError } from '../../../../api/extractApiError';

interface RegisterNoteViewModel {
  titulo: string;
  descricao: string;
  categoriaIds: string[];
}

@Component({
  selector: 'app-registerNote',
  standalone: true,
  imports: [RouterLink, FormField],
  templateUrl: './registerNote.html',
})
export class RegisterNotes {
  private readonly serviceNotes = inject(ServiceNotes);
  private readonly serviceCategories = inject(ServiceCategories);
  private readonly router = inject(Router);

  constructor() {}

  protected readonly errorMessage = signal<string | null>(null);

  protected readonly modelForm = signal<RegisterNoteViewModel>({
    titulo: '',
    descricao: '',
    categoriaIds: [],
  });

  protected readonly noteTitle = computed(() => this.modelForm().titulo);
  protected readonly noteDescription = computed(() => this.modelForm().descricao);
  protected readonly selectedCategoryIds = computed(() => this.modelForm().categoriaIds);

  protected formRegisterNote = form(this.modelForm, (model) => {
    required(model.titulo, { message: 'Title is required.' });
    required(model.descricao, { message: 'Description is required.' });
    minLength(model.titulo, 2, {
      message: 'Title must be between 2 and 100 characters.',
    });
    maxLength(model.titulo, 100, {
      message: 'Title must be between 2 and 100 characters.',
    });
    maxLength(model.descricao, 300, {
      message: 'Description must have at most 300 characters.',
    });
  });

  protected readonly categories = toSignal(
    this.serviceCategories
      .list()
      .pipe(map((list: ListCategoriesResponse[]) => toViewModelCategory(list))),
  );

  protected toggleCategory(id: string): void {
    this.formRegisterNote
      .categoriaIds()
      .value.update((categorias) =>
        categorias.includes(id)
          ? categorias.filter((categoriaId) => categoriaId !== id)
          : [...categorias, id],
      );
  }

  registerNote(event: Event) {
    event.preventDefault();
    this.errorMessage.set(null);

    if (!this.formRegisterNote().valid()) {
      this.formRegisterNote.titulo().markAsTouched();
      this.formRegisterNote.descricao().markAsTouched();
      return;
    }

    const data = this.modelForm();

    this.serviceNotes.register(data).subscribe({
      next: () => {
        this.router.navigate(['/notes']);
      },
      error: (erro: HttpErrorResponse) => {
        this.errorMessage.set(extractApiError(erro));
      },
    });
  }
}
