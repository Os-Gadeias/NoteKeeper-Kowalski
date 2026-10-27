import { Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ServiceCategories } from '../../../service/categories/serviceCategories';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { extractApiError } from '../../../../api/extractApiError';

interface CategoryViewModel {
  id: string;
  titulo: string;
  icone: string;
}

interface CategoryIcon {
  name: string;
  label: string;
}

@Component({
  selector: 'app-editCategory',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './updateCategory.html',
})
export class UpdateCategory {
  private readonly serviceCategories = inject(ServiceCategories);
  private readonly router = inject(Router);

  // ID recebido pela rota
  readonly id = input.required<string>();

  // Estados
  protected readonly categoryTitle = signal('');
  protected readonly selectedIcon = signal('');

  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly categoryIcons: CategoryIcon[] = [
    { name: 'bi-folder-fill', label: 'Folder' },
    { name: 'bi-book-fill', label: 'Books' },
    { name: 'bi-briefcase-fill', label: 'Work' },
    { name: 'bi-mortarboard-fill', label: 'Education' },

    { name: 'bi-house-fill', label: 'Home' },
    { name: 'bi-heart-fill', label: 'Personal' },
    { name: 'bi-lightbulb-fill', label: 'Ideas' },
    { name: 'bi-code-slash', label: 'Programming' },

    { name: 'bi-calendar-event-fill', label: 'Events' },
    { name: 'bi-cart-fill', label: 'Shopping' },
    { name: 'bi-wallet-fill', label: 'Finances' },
    { name: 'bi-gear-fill', label: 'Settings' },

    { name: 'bi-star-fill', label: 'Favorites' },
    { name: 'bi-music-note-beamed', label: 'Music' },
    { name: 'bi-controller', label: 'Games' },
    { name: 'bi-airplane-fill', label: 'Travel' },
  ];

  // Nome do ícone selecionado
  protected readonly selectedIconLabel = computed(() => {
    const icon = this.categoryIcons.find((item) => item.name === this.selectedIcon());

    return icon?.label ?? 'Unknown icon';
  });

  // Validação
  protected readonly isFormValid = computed(() => {
    const title = this.categoryTitle().trim();

    return title.length >= 2 && title.length <= 100 && this.selectedIcon().length > 0;
  });

  constructor() {
    toObservable(this.id)
      .pipe(
        switchMap((id) => {
          this.isLoading.set(true);
          this.errorMessage.set(null);

          return this.serviceCategories.getById(id);
        }),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (category: CategoryViewModel) => {
          // Preenche o formulário com os dados da API
          this.categoryTitle.set(category.titulo);
          this.selectedIcon.set(category.icone);

          this.isLoading.set(false);
        },

        error: (error: HttpErrorResponse) => {
          this.errorMessage.set(extractApiError(error));
          this.isLoading.set(false);
        },
      });
  }

  protected onTitleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.categoryTitle.set(input.value);
  }

  protected selectIcon(icon: string): void {
    this.selectedIcon.set(icon);
  }

  protected updateCategory(event: Event): void {
    event.preventDefault();

    if (!this.isFormValid() || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);

    const request = {
      titulo: this.categoryTitle().trim(),
      icone: this.selectedIcon(),
    };

    // Ajuste o nome do método conforme seu ServiceCategories
    this.serviceCategories.update(this.id(), request).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/categories']);
      },

      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMessage.set(extractApiError(error));
      },
    });
  }
}
