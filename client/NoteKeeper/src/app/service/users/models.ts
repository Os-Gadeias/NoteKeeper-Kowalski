export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  usuarioId: string;
  nome: string;
  email: string;
  accessToken: string;
  dataExpiracaoEmUtc: string;
}

export interface CreateUserRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface CreateUserResponse {
  id: string;
  nome: string;
  email: string;
}
