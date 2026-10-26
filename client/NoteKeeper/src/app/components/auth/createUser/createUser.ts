import { Component, signal } from '@angular/core';
import { email, form, minLength, pattern, required, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

interface CreateUserModel {
  username: string;
  email: string;
  senha: string;
  confirmSenha: string;
}

@Component({
  selector: 'app-createUser',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './createUser.html',
})
export class CreateUser {
  protected modelForm = signal<CreateUserModel>({
    username: '',
    email: '',
    senha: '',
    confirmSenha: '',
  });

  protected createUserModel = form(this.modelForm, (model) => {
    required(model.username, { message: 'Username is required!' });
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
}
