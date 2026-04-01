import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const pin = authService.getPin();

  const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (pin && writeMethods.includes(req.method)) {
    const cloned = req.clone({
      headers: req.headers.set('x-admin-pin', pin)
    });
    return next(cloned);
  }

  return next(req);
};
