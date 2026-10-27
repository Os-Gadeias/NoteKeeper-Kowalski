import { Component, input } from '@angular/core';

@Component({
  selector: 'app-deleteCategory',
  standalone: true,
  imports: [],
  templateUrl: './deleteCategory.html',
})
export class DeleteCategory {
  constructor() {}

  readonly id = input.required<string>();

  
}
