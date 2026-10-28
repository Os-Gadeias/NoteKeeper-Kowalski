export interface ListNotesResponse {
  id: string;
  titulo: string;
  icone: string;
  categorias: Category[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface RegisterNoteRequest {
  titulo: string;
  descricao: string;
  categoriaIds: string[];
}

export interface GetByIdNoteResponse {
  id: string;
  titulo: string;
  icone: string;
  categorias: Category[];
  criadoEm: string;
  atualizadoEm: string;
}

interface Category {
  id: string;
  titulo: string;
  icone: string;
}
