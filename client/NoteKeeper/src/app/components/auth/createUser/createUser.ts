import { Component, signal } from '@angular/core';
import {
  email,
  form,
  minLength,
  pattern,
  required,
  validate,
  FormField,
} from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { ServiceAuth } from '../../../service/users/serviceAuth';
import { extractApiError } from '../../../../api/extractApiError';
import { HttpErrorResponse } from '@angular/common/http';

interface CreateUserModel {
  nome: string;
  email: string;
  senha: string;
  confirmSenha: string;
}

@Component({
  selector: 'app-createUser',
  standalone: true,
  imports: [RouterLink, FormField],
  templateUrl: './createUser.html',
})
export class CreateUser {
  constructor(
    protected serviceAuth: ServiceAuth,
    protected router: Router,
  ) {}

  protected errorMessage = signal<string | null>(null);

  protected modelForm = signal<CreateUserModel>({
    nome: '',
    email: '',
    senha: '',
    confirmSenha: '',
  });

  protected createUserModel = form(this.modelForm, (model) => {
    required(model.nome, { message: 'Username is required!' });
    required(model.email, { message: 'Email is required!' });
    required(model.senha, { message: 'Password is required!' });
    required(model.confirmSenha, { message: 'Confirm passowrd is required!' });
    email(model.email, { message: 'Enter a valid email.' });
    minLength(model.senha, 8, { message: 'The password must have at least 8 characters' });
    pattern(model.senha, /(?=.*\d)(?=.*[^a-zA-Z0-9]).+/, {
      message: 'Include at least one number and special characters',
    });
    validate(model.confirmSenha, ({ value, valueOf }) => {
      const senha = valueOf(model.senha);
      const senhaConfirmada = value();

      if (senha !== senhaConfirmada) {
        return {
          kind: 'senha',
          message: 'The passwords dont match!',
        };
      }
      return null;
    });
  });
  sendCreateUser(event: Event) {
    event.preventDefault();
    this.errorMessage.set(null);

    const dados = this.modelForm;

    this.serviceAuth.register(dados()).subscribe({
      next: () => {},
      error: (erro: HttpErrorResponse) => {
        this.errorMessage.set(extractApiError(erro));
      },
    });
  }
}
