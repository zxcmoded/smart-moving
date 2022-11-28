import { LoginResult as x } from '../generated/Authentication/login-result';

export class LoginResult extends x {

  successful: boolean;

  static failed() {
    const result = new LoginResult();
    result.successful = false;
    return result;
  }

  constructor() {
    super();
    this.successful = false;
  }
}
