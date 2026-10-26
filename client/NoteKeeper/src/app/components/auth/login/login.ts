import { Component, Inject, signal } from '@angular/core';
import { form, required, FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { ServiceAuth } from '../../../service/users/serviceAuth';

interface LoginModel {
  email: string;
  senha: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormField],
  templateUrl: './login.html',
})
export class Login {
  // errorMessage: '';

  constructor(protected serviceAuth: ServiceAuth) {}

  protected modelForm = signal<LoginModel>({
    email: '',
    senha: '',
  });

  protected FormLogin = form(this.modelForm, (model) => {
    required(model.email, { message: 'The email is required!' });
    required(model.senha, { message: 'The passoword is required!' });
  });

  sendLoginUser(event: Event) {
    event.preventDefault();

    const dados = this.modelForm();

    this.serviceAuth.login(dados).subscribe({
      next: (result) => {
        console.log(result.acessToken);
      },
    });
  }
}
