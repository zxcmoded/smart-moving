import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { CurrentUserService } from '../current-user.service';
import { Permission } from 'app/generated/SmartMoving/Core/Data/Security/permission';

@Injectable({
  providedIn: 'root'
})
export class RequireAuthenticatedGuard implements CanActivate, CanActivateChild {

  constructor(
      private readonly currentUser: CurrentUserService,
      private readonly router: Router,
      private readonly notifications: NotificationsService,
  ) {
  }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.currentUser.instance.authenticated) {
      window.location.href = `login?returnUrl=${state.url}`;
      return false;
    }

    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.currentUser.instance.authenticated) {
      window.location.href = `login?returnUrl=${state.url}`;
      return false;
    }

    if (childRoute.data && childRoute.data.allowedPermissions) {
      if (!this.currentUser.hasAnyPermission(childRoute.data.allowedPermissions as Permission[])) {

        this.notifications.warn('Permission denied', 'You do not have permission to access that');

        const homeRoute = this.currentUser.getDefaultRoute() || 'login';

        this.router.navigateByUrl(homeRoute).then(res => {
          if (!res) {
            window.location.href = `login`;
          }
        });

        return false;
      }
    }

    return true;
  }
}
