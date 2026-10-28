import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ProvideUser } from './provideUser';

export const isAnonymousGuard: CanActivateFn = (): true | UrlTree => {
  const provideUser = inject(ProvideUser);
  const router = inject(Router);

  return !provideUser.isLoggedIn() ? true : router.createUrlTree(['/notesPage']);
};

export const isAuthenticatedGuard: CanActivateFn = (): true | UrlTree => {
  const provideUser = inject(ProvideUser);
  const router = inject(Router);

  return provideUser.isLoggedIn() ? true : router.createUrlTree(['/loginPage']);
};
