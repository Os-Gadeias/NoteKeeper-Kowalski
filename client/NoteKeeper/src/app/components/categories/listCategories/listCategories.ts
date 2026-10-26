import { Component, signal } from '@angular/core';

interface Category {
  id: string;
  nome: string;
}

@Component({
  selector: 'app-listCourse',
  standalone: true,
  imports: [],
  templateUrl: './listCategories.html',
})
export class ListCategories {
  protected readonly categories = signal<Category[]>([
    {
      id: '1',
      nome: 'Personal',
    },
    {
      id: '2',
      nome: 'Work',
    },
    {
      id: '3',
      nome: 'Studies',
    },
    {
      id: '4',
      nome: 'Important',
    },
    {
      id: '5',
      nome: 'Projects',
    },
    {
      id: '6',
      nome: 'Ideas',
    },
  ]);
}
