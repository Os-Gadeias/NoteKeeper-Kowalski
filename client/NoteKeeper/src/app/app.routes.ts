import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'loginPage', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login').then((component) => component.Login),
  },
  { path: 'createUserPage', redirectTo: 'createUser' },
  {
    path: 'createUser',
    loadComponent: () =>
      import('./components/auth/createUser/createUser').then((component) => component.CreateUser),
  },
  { path: 'categoriesPage', redirectTo: 'categories' },
  {
    path: 'categories',
    loadComponent: () =>
      import('./components/categories/listCategories/listCategories').then(
        (component) => component.ListCategories,
      ),
  },
];
