import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'loginPage', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((component) => component.Login),
  },
  { path: 'createUserPage', redirectTo: 'createUser' },
  {
    path: 'createUser',
    loadComponent: () =>
      import('./components/createUser/createUser').then((component) => component.CreateUser),
  },
];
