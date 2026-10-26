import { Component, signal } from '@angular/core';
import { form, required, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { ServiceAuth } from '../../../service/users/serviceAuth';
import { HttpErrorResponse } from '@angular/common/http';
import { extractApiError } from '../../../../api/extractApiError';

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
  protected errorMessage = '';

  constructor(
    protected serviceAuth: ServiceAuth,
    protected router: Router,
  ) {}

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
      next: () => {
        this.router.navigate(['']);
      },
      error: (erro: HttpErrorResponse) => {
        this.errorMessage = extractApiError(erro);
      },
    });
  }
}
