import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectToHomepageGuard implements CanActivate {

  constructor(
    private currentUser: CurrentUserService,
    private router: Router
  ) { }

  canActivate() {
    let target = this.currentUser.getDefaultRoute();

    if (!this.currentUser.isAuthenticated()) {
      target = 'login';
    } else if (!target) {
      target = 'home';
    }
    this.router.navigateByUrl(target);

    return false;
  }
}
