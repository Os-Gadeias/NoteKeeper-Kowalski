import { Component, computed, inject, Inject, signal } from '@angular/core';
import { ServiceCategories } from '../../../service/categories/serviceCategories';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { extractApiError } from '../../../../api/extractApiError';

interface CategoryIcon {
  name: string;
  label: string;
}

@Component({
  selector: 'app-registerCategorie',
  standalone: true,
  imports: [],
  templateUrl: './registerCategory.html',
})
export class RegisterCategory {
  protected serviceCategories = inject(ServiceCategories);

  constructor(protected router: Router) {}

  protected erroMessage = '';

  protected readonly categoryTitle = signal('');

  protected readonly selectedIcon = signal('bi-folder-fill');

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

  protected readonly selectedIconLabel = computed(() => {
    const icon = this.categoryIcons.find((item) => item.name === this.selectedIcon());

    return icon?.label ?? 'Folder';
  });

  protected readonly isFormValid = computed(() => {
    const title = this.categoryTitle().trim();

    return title.length >= 2 && title.length <= 100 && this.selectedIcon().length > 0;
  });

  protected onTitleInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.categoryTitle.set(input.value);
  }

  protected selectIcon(icon: string): void {
    this.selectedIcon.set(icon);
  }

  protected registerCategory(event: Event): void {
    event.preventDefault();

    if (!this.isFormValid()) {
      return;
    }

    const category = {
      titulo: this.categoryTitle().trim(),
      icone: this.selectedIcon(),
    };

    console.log('Category to register:', category);

    this.serviceCategories.register(category).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (erro: HttpErrorResponse) => {
        this.erroMessage = extractApiError(erro);
      },
    });
  }
}
