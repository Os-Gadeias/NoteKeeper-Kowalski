import { Component, inject, signal } from '@angular/core';
import { ServiceNotes } from '../../../service/notes/serviceNotes';
import { ServiceCategories } from '../../../service/categories/serviceCategories';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ListCategoriesResponse } from '../../../service/categories/models';
import { toViewModelCategory } from '../../util';

@Component({
  selector: 'app-registerNote',
  standalone: true,
  imports: [],
  templateUrl: './registerNote.html',
})
export class RegisterNotes {
  private readonly serviceNotes = inject(ServiceNotes);
  private readonly serviceCategories = inject(ServiceCategories);

  constructor() {}

  protected readonly noteTitle = signal('');
  protected readonly noteDescription = signal('');
  protected readonly selectedCategoryIds = signal<string[]>([]);

  protected readonly categories = toSignal(
    this.serviceCategories
      .list()
      .pipe(map((list: ListCategoriesResponse[]) => toViewModelCategory(list))),
  );

  protected toggleCategory(id: string): void {
    this.selectedCategoryIds.update((selected) =>
      selected.includes(id)
        ? selected.filter((categoryId) => categoryId !== id)
        : [...selected, id],
    );
  }

  registerNote(event: Event) {
    event.preventDefault();
  }
}
