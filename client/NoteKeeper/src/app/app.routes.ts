import { Routes } from '@angular/router';
import { isAnonymousGuard, isAuthenticatedGuard } from './auth/auth.guards';

export const routes: Routes = [
  // AUTH
  {
    path: 'loginPage',
    redirectTo: 'login',
  },
  {
    path: 'login',
    canActivate: [isAnonymousGuard],
    loadComponent: () =>
      import('./components/auth/login/login').then((component) => component.Login),
  },
  {
    path: 'createUserPage',
    redirectTo: 'createUser',
  },
  {
    path: 'createUser',
    canActivate: [isAnonymousGuard],
    loadComponent: () =>
      import('./components/auth/createUser/createUser').then((component) => component.CreateUser),
  },

  // CATEGORIES
  {
    path: 'categoriesPage',
    redirectTo: 'categories',
  },
  {
    path: 'categories',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import('./components/categories/listCategories/listCategories').then(
        (component) => component.ListCategories,
      ),
  },
  {
    path: 'registerCategoryPage',
    redirectTo: 'category/register',
  },
  {
    path: 'category/register',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import('./components/categories/registerCategory/registerCategory').then(
        (component) => component.RegisterCategory,
      ),
  },
  {
    path: 'deleteCategoryPage/:id',
    redirectTo: 'category/delete/:id',
  },
  {
    path: 'category/delete/:id',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import('./components/categories/deleteCategory/deleteCategory').then(
        (component) => component.DeleteCategory,
      ),
  },
  {
    path: 'updateCategoryPage/:id',
    redirectTo: 'category/update/:id',
  },
  {
    path: 'category/update/:id',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import('./components/categories/updateCategory/updateCategory').then(
        (component) => component.UpdateCategory,
      ),
  },

  // NOTES
  {
    path: 'notesPage',
    redirectTo: 'notes',
  },
  {
    path: 'notes',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import('./components/notes/listNotes/listNotes').then((component) => component.ListNotes),
  },
  {
    path: 'registerNotesPage',
    redirectTo: 'notes/register',
  },
  {
    path: 'notes/register',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import('./components/notes/registerNote/registerNote').then(
        (component) => component.RegisterNotes,
      ),
  },
  {
    path: 'deleteNotePage/:id',
    redirectTo: 'note/delete/:id',
  },
  {
    path: 'note/delete/:id',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import('./components/notes/deleteNote/deleteNote').then((component) => component.DeleteNote),
  },
  {
    path: 'updateNotePage/:id',
    redirectTo: 'notes/update/:id',
  },
  {
    path: 'notes/update/:id',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import('./components/notes/updateNote/updateNote').then((component) => component.UpdateNote),
  },

  // DEFAULT ROUTE
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'notes',
  },

  // NOT FOUND
  {
    path: '**',
    redirectTo: 'notes',
  },
];
