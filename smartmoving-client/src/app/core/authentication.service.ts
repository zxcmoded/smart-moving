import { Injectable } from '@angular/core';
import { LoginResult } from './login-result';
import { ApiClientService } from './api-client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginForm } from '../generated/Authentication/login-form';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private readonly router: Router,
    private readonly apiClient: ApiClientService
  ) { }

  async login(form: LoginForm): Promise<LoginResult> {

    try {
      const result = await this.apiClient.post<LoginResult>('authentication/login', form);
      result.successful = true;
      return result;
    } catch (err) {
      if ((err as HttpErrorResponse).status === 401) {
        return LoginResult.failed();
      } else {
        console.error('Something went wrong!', err);
        return LoginResult.failed();
      }
    }
  }

  setAutomaticLogoutInterval() {
    setInterval(async () => {
      try {
        await this.apiClient.get<LoginResult>('authentication/authenticated');
      } catch (err) {
        if ((err as HttpErrorResponse).status === 401) {
          this.router.navigate(['logout']);
          return;
        }
        console.error(err);
      }
    }, 30 * 60_000); // 30 minutes
  }
}
