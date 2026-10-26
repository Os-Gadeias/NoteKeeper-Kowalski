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
import { RouterLink } from '@angular/router';
import { ServiceAuth } from '../../../service/users/serviceAuth';

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
  constructor(protected serviceAuth: ServiceAuth) {}

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
          kind: 'senhaConfirmada',
          message: 'The passwords dont match!',
        };
      }
      return null;
    });
  });
  sendCreateUser(event: Event) {
    event.preventDefault();

    const dados = this.modelForm;

    this.serviceAuth.register(dados()).subscribe({
      next: (valor) => {
        console.log(valor.email);
        console.log(valor.nome);
        console.log(valor.id);
      },
    });
  }
}
