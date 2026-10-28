export interface ListNotesResponse {
  id: string;
  titulo: string;
  icone: string;
  categorias: Category[];
  criadoEm: string;
  atualizadoEm: string;
  status: string;
}

export interface RegisterNoteRequest {
  titulo: string;
  descricao: string;
  categoriaIds: string[];
}

export interface GetByIdNoteResponse {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  categorias: Category[];
  criadoEm: string;
  atualizadoEm: string;
  status: string;
}

interface Category {
  id: string;
  titulo: string;
  icone: string;
}

export interface UpdateNoteRequest {
  titulo: string;
  descricao: string;
  categoriaIds: string[];
  status: string;
}
