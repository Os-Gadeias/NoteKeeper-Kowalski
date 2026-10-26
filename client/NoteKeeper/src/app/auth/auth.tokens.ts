import { InjectionToken } from '@angular/core';
import { environment } from '../enviroments/enviroment.develolment';

export const URL_API = new InjectionToken<string>('URL_API', {
  providedIn: 'root',
  factory: () => environment.urlApi,
});
