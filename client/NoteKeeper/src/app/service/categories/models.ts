export interface RegisterCategoryRequest {
  titulo: string;
  icone: string;
}
export interface RegisterCategoryResponse {
  id: string;
  titulo: string;
  icone: string;
}

export interface ListCategoriesResponse {
  id: string;
  titulo: string;
  icone: string;
}

export interface GetByIdResponse {
  id: string;
  titulo: string;
  icone: string;
}
