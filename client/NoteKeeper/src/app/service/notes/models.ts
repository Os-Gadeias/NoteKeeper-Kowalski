export interface ListNotesResponse {
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

export interface RegisterNoteRequest {
  titulo: string;
  descricao: string;
  categoriaIds: string[];
}
