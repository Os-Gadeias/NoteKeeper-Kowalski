import { ListCategoriesResponse } from '../service/categories/models';

export interface CategoryViewModel {
  id: string;
  titulo: string;
  icone: string;
}

export function toViewModel(model: ListCategoriesResponse[]): CategoryViewModel[] {
  return model.map((category) => ({
    id: category.id,
    titulo: category.titulo,
    icone: category.icone,
  }));
}
