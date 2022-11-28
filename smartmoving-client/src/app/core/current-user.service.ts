import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResult } from './login-result';
import { Permission } from 'app/generated/SmartMoving/Core/Data/Security/permission';
import { UUID } from 'angular2-uuid';
import { LocalStorageKeys } from 'app/shared/local-storage-keys';

export interface CurrentUser {
  id: string;
  displayName: string;
  userTitle: string;
  email: string;
  authenticated: boolean;
  token: string;
  phoneNumber: string;
  userCreatedAtUtc: string;
  permissions: string;
  roleName: string;

  companyId: string;
  companyName: string;
  companyCreatedAtUtc: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  public instance = {} as CurrentUser;

  private _lastCompanyId = '';
  private _lastCacheBustValue = '';

  constructor(private readonly router: Router) {
    this.tryLoad();
  }

  public isAuthenticated() {
    return this.instance.authenticated;
  }

  get cacheBustValue() {
    if (!this.instance || !this.instance.companyId) {
      return '';
    }

    if (this._lastCompanyId === this.instance.companyId) {
      return this._lastCacheBustValue;
    }

    this._lastCompanyId = this.instance.companyId;
    this.resetCacheBust();
    return this._lastCacheBustValue;
  }

  resetCacheBust() {
    this._lastCacheBustValue = UUID.UUID();
  }

  loginFromResult(result: LoginResult) {
    this.instance = Object.assign({ authenticated: true }, result) as CurrentUser;

    this.persist();
  }

  persist() {
    localStorage.setItem(LocalStorageKeys.CURRENT_USER, JSON.stringify(this.instance));
  }

  private tryLoad() {
    const json = localStorage.getItem(LocalStorageKeys.CURRENT_USER);

    if (json !== null) {
      const model = JSON.parse(json) as CurrentUser;

      this.instance = model;
    }
  }

  logout() {
    localStorage.removeItem(LocalStorageKeys.CURRENT_USER);
    localStorage.removeItem(LocalStorageKeys.BRANCH);
    sessionStorage.clear();


    this.instance = {} as CurrentUser;
  }

  checkAndHandleIfUserShouldLogBackIn() {
    if (!this.instance ||
        !this.instance.permissions ||
        this.instance.permissions.length === 0) {
      this.logout();
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigate(['login']);
      return;
    }
  }

  hasAnyPermission(permissions: Permission[]) {
    this.checkAndHandleIfUserShouldLogBackIn();
    return permissions.some(x => this.hasPermission(x));
  }

  hasPermission(permission: Permission) {
    this.checkAndHandleIfUserShouldLogBackIn();
    return this.instance.permissions && this.instance.permissions.length && this.instance.permissions.indexOf(`|${permission}|`) > -1;
  }

  getDefaultRoute() {
    if (this.hasPermission(Permission.CompanyDashboard)) {
      return '/home';
    }

    if (this.hasPermission(Permission.Customers)) {
      return '/customers';
    }
  }
}
