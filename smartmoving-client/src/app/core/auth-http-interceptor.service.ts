import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpInterceptorService implements HttpInterceptor {

  constructor(
    private currentUser: CurrentUserService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
    .pipe(
      catchError(error => {
          if (error instanceof HttpErrorResponse) {
            this.handleError(error);
          }
          return throwError(error);
      })
    );
  }

  handleError(error: HttpErrorResponse) {
    // Don't redirect if it is a 401 on the login page
    if (error.status === 401 && this.router.url !== '/login') {
      this.currentUser.logout();
      window.location.href = `login`;
      return;
    }

    const dontRedirectOn402 = ['/login', '/logout', '/payment-due'];

    // 402 - Payment required
    if (error.status === 402 && !dontRedirectOn402.includes(this.router.url)) {
      window.location.href = `payment-due`;
      return;
    }
  }
}
