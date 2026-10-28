import { Component, inject } from '@angular/core';
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

  protected readonly categories = toSignal(
    this.serviceCategories
      .list()
      .pipe(map((list: ListCategoriesResponse[]) => toViewModelCategory(list))),
  );
}
