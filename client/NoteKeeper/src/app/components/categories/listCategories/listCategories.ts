import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceCategories } from '../../../service/categories/serviceCategories';
import { map } from 'rxjs';
import { ListCategoriesResponse } from '../../../service/categories/models';
import { toSignal } from '@angular/core/rxjs-interop';
import { toViewModelCategory } from '../../util';

@Component({
  selector: 'app-listCourse',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './listCategories.html',
})
export class ListCategories {
  protected serviceCategories = inject(ServiceCategories);

  protected readonly searchTerm = signal('');

  protected readonly categories = toSignal(
    this.serviceCategories
      .list()
      .pipe(map((list: ListCategoriesResponse[]) => toViewModelCategory(list))),
  );

  protected readonly filteredCategories = computed(() => {
    const name = this.searchTerm();
    const categoriesFiltered = this.categories();

    return categoriesFiltered?.filter((category) =>
      category.titulo.toLowerCase().includes(name.toLowerCase()),
    );
  });
}
