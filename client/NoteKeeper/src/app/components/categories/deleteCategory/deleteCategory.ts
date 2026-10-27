import { Component, inject, input } from '@angular/core';
import { ServiceCategories } from '../../../service/categories/serviceCategories';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-deleteCategory',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './deleteCategory.html',
})
export class DeleteCategory {
  private readonly serviceCategories = inject(ServiceCategories);

  readonly id = input.required<string>();

  protected readonly category = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.serviceCategories.getById(id))),
    {
      initialValue: null,
    },
  );
  deleteCategory() {
    
  }
}
