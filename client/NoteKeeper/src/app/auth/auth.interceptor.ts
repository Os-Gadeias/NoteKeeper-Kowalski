import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { ServiceStorage } from './serviceStorage';
import { URL_API } from './auth.tokens';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const serviceStorage = inject(ServiceStorage);
  const urlApi = inject(URL_API);

  const token = serviceStorage.get('token');

  // Não adiciona o token a requisições externas
  const isApiRequest = req.url === urlApi || req.url.startsWith(`${urlApi}/`);

  if (!token || !isApiRequest) {
    return next(req);
  }

  // Clona a requisição e adiciona o JWT
  const authRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authRequest);
};
