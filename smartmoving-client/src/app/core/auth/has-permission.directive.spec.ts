import { ViewContainerRef } from '@angular/core';
import { Permission } from 'app/generated/SmartMoving/Core/Data/Security/permission';
import { HasPermissionDirective } from './has-permission.directive';
import { CurrentUserService } from '../current-user.service';
import { nameof } from '../nameof';

describe(nameof(HasPermissionDirective), () => {
  let sut: HasPermissionDirective;
  let spyTemplate: any;
  let spyViewContainer: jasmine.SpyObj<ViewContainerRef>;
  let spyCurrentUserService: jasmine.SpyObj<CurrentUserService>;

  beforeEach(() => {
    spyTemplate = {};
    spyViewContainer = jasmine.createSpyObj('ViewContainerRef', [
      nameof<ViewContainerRef>(x => x.createEmbeddedView),
      nameof<ViewContainerRef>(x => x.clear)
    ]);
    spyCurrentUserService = jasmine.createSpyObj(nameof(CurrentUserService), [
      nameof<CurrentUserService>(x => x.hasPermission),
      nameof<CurrentUserService>(x => x.hasAnyPermission)
    ]);
    sut = new HasPermissionDirective(spyTemplate, spyViewContainer, spyCurrentUserService);
  });

  it('should create an instance', () => {
    expect(sut).toBeTruthy();
  });

  describe('when testing default (OR) operator', () => {
    describe('and user has permission', () => {
      beforeEach(() => {
        sut.smHasPermission = [Permission.Sales, Permission.Settings];
        spyCurrentUserService.hasAnyPermission.and.returnValues(true);
      });

      it('should return true', () => {
        expect(sut.checkPermissions()).toEqual(true);
      });
    });

    describe('and user doesnt have permission', () => {
      beforeEach(() => {
        sut.smHasPermission = [Permission.Sales];
        spyCurrentUserService.hasAnyPermission.and.returnValue(false);
      });

      it('should return false', () => {
        expect(sut.checkPermissions()).toEqual(false);
      });
    });
  });

  describe('when testing NONE operator', () => {
    describe('and user has permission', () => {
      beforeEach(() => {
        sut.smHasPermission = [Permission.Sales];
        sut.smHasPermissionOp = 'NONE';
        spyCurrentUserService.hasAnyPermission.and.returnValue(true);
      });

      it('should return false', () => {
        expect(sut.checkPermissions()).toEqual(false);
      });
    });

    describe('and user doesnt have permission', () => {
      beforeEach(() => {
        sut.smHasPermission = [Permission.Sales];
        sut.smHasPermissionOp = 'NONE';
        spyCurrentUserService.hasAnyPermission.and.returnValue(false);
      });

      it('should return true', () => {
        expect(sut.checkPermissions()).toEqual(true);
      });
    });
  });

  describe('when testing AND operator', () => {
    describe('and user has all permissions', () => {
      beforeEach(() => {
        sut.smHasPermission = [Permission.Sales, Permission.Settings, Permission.ReportMarketing];
        sut.smHasPermissionOp = 'AND';
        spyCurrentUserService.hasPermission.and.returnValue(true);
      });

      it('should return true', () => {
        expect(sut.checkPermissions()).toEqual(true);
      });
    });

    describe('and user doesnt have any of the permissions', () => {
      beforeEach(() => {
        sut.smHasPermission = [Permission.Sales, Permission.Settings, Permission.ReportMarketing];
        sut.smHasPermissionOp = 'AND';
        spyCurrentUserService.hasPermission.and.returnValue(false);
      });

      it('should return false', () => {
        expect(sut.checkPermissions()).toEqual(false);
      });
    });

    describe('and user has some of the permissions', () => {
      beforeEach(() => {
        sut.smHasPermission = [Permission.Sales, Permission.Settings, Permission.ReportMarketing];
        sut.smHasPermissionOp = 'AND';
        spyCurrentUserService.hasPermission.and.returnValues(true, false, true);
      });

      it('should return false', () => {
        expect(sut.checkPermissions()).toEqual(false);
      });
    });
  });
});
