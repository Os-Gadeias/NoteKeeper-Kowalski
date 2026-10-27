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
  { path: 'registerCategoryPage', redirectTo: 'category/register' },
  {
    path: 'category/register',
    loadComponent: () =>
      import('./components/categories/registerCategory/registerCategory').then(
        (component) => component.RegisterCategory,
      ),
  },
  { path: 'deleteCategoryPage/:id', redirectTo: 'category/delete/:id' },
  {
    path: 'category/delete/:id',
    loadComponent: () =>
      import('./components/categories/deleteCategory/deleteCategory').then(
        (component) => component.DeleteCategory,
      ),
  },
  { path: 'updateCategoryPage/:id', redirectTo: 'category/update/:id' },
  {
    path: 'category/update/:id',
    loadComponent: () =>
      import('./components/categories/updateCategory/updateCategory').then(
        (component) => component.UpdateCategory,
      ),
  },
];
