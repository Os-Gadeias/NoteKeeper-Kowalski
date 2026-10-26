import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', redirectTo: 'loginPage' },
  {
    path: 'loginPage',
    loadComponent: () => import('./components/login/login').then((component) => component.Login),
  },
];
