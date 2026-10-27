import { Component, inject, input, signal } from '@angular/core';
import { ServiceCategories } from '../../../service/categories/serviceCategories';
import { Router, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { extractApiError } from '../../../../api/extractApiError';

@Component({
  selector: 'app-deleteCategory',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './deleteCategory.html',
})
export class DeleteCategory {
  private readonly serviceCategories = inject(ServiceCategories);

  constructor(private router: Router) {}

  protected errorMessage = signal<string | null>(null);

  readonly id = input.required<string>();

  protected readonly category = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.serviceCategories.getById(id))),
    {
      initialValue: null,
    },
  );
  deleteCategory() {
    this.serviceCategories.delete(this.id()).subscribe({
      next: () => {
        this.router.navigate(['categoriesPage']);
      },
      error: (erro: HttpErrorResponse) => {
        this.errorMessage.set(extractApiError(erro));
      },
    });
  }
}
