import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { CurrentUserService } from 'app/core/current-user.service';
import { Permission } from 'app/generated/SmartMoving/Core/Data/Security/permission';

/* "Borrowed" from https://juristr.com/blog/2018/02/angular-permission-directive/

Example 1: (OR - Default)
*smHasPermission="[Permission.Sales, Permission.Dispatch]"
If user has any of those, the element will be shown.

Example 2: (AND)
*smHasPermission="[Permission.Sales, Permission.Dispatch]; op 'AND'"
If user has ALL of them, then element will be shown.

Example 3: (NONE)
*smHasPermission="['SalesPerson']; op 'NONE'"
User will see this element only if they have NONE of the permissions given.
Useful for showing readonly content, or "You can't do the thing" messages.

Note: Previously we had "only" which doesn't make sense anymore.
*/
@Directive({
  selector: '[smHasPermission]'
})
export class HasPermissionDirective implements OnInit {
  private permissions: Permission[];
  private logicalOp: 'OR' | 'AND' | 'NONE' = 'OR';
  private isHidden = true;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private currentUserService: CurrentUserService
  ) {
  }

  ngOnInit() {
    this.updateView();
  }

  @Input()
  set smHasPermission(val: Permission[]) {
    this.permissions = val;
    this.updateView();
  }

  @Input()
  set smHasPermissionOp(permop: 'OR' | 'AND' | 'NONE') {
    this.logicalOp = permop;
    this.updateView();
  }

  private updateView() {
    if (this.checkPermissions()) {
      if (this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      this.viewContainer.clear();
    }
  }

  checkPermissions() {
    if (this.logicalOp === 'NONE') {
      return !this.currentUserService.hasAnyPermission(this.permissions);
    }

    if (this.logicalOp === 'OR') {
      return this.currentUserService.hasAnyPermission(this.permissions);
    }

    if (this.logicalOp === 'AND') {
      for (const permission of this.permissions) {
        if (!this.currentUserService.hasPermission(permission)) {
          return false;
        }
      }
      return true;
    }

    throw new Error(`Invalid operator ${this.logicalOp} passed to has-permission directive`);
  }
}
