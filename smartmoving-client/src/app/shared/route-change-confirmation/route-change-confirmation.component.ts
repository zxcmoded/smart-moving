import { Component, OnInit, ViewChild, TemplateRef, Input, HostListener } from '@angular/core';
import { DeactivationGuarded } from './can-deactivate-guard';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

/* TO USE:
  1) Add the CanDeactivateGuard to the route definition:
        {
          path: '',
          component: <Component>,
          canDeactivate: [CanDeactivateGuard]
        }
  2) Add an instance of sm-route-change-confirmation to your view:
        <sm-route-change-confirmation #routeChangeConfirmation [navigationAllowed]="numberOfChanges === 0"></sm-route-change-confirmation>
  3) Reference the RouteChangeConfirmation as a ViewChild:
        @ViewChild(RouteChangeConfirmationComponent) routeChangeConfirmation: RouteChangeConfirmationComponent;
  4) Make the component implement the DeactivationGuarded interface and implement like so:
        canDeactivate() {
          return this.routeChangeConfirmation.canDeactivate();
        }
 */

@Component({
  selector: 'sm-route-change-confirmation',
  templateUrl: './route-change-confirmation.component.html'
})
export class RouteChangeConfirmationComponent implements OnInit, DeactivationGuarded {

  @ViewChild('confirmCloseModal', { static: true }) confirmCloseModal: TemplateRef<any>;

  @Input() navigationAllowed: boolean;
  @Input() message = 'If you leave now, your changes will be lost.';

  confirmCloseDialog: MatDialogRef<any>;

  constructor(private readonly matDialog: MatDialog) {
  }

  ngOnInit() {
  }

  @HostListener('window:beforeunload', ['$event'])
  windowBeforeUnload($event) {
    if (!this.navigationAllowed) {
      $event.preventDefault();
      // Chrome requires returnValue to be set.
      $event.returnValue = '';
    }
  }

  async canDeactivate() {
    if (!this.navigationAllowed) {
      this.confirmCloseDialog = this.matDialog.open(this.confirmCloseModal, { autoFocus: false });
      return await this.confirmCloseDialog.afterClosed().toPromise();
    }
    return true;
  }

  closeConfirmRouteChange(flag) {
    this.confirmCloseDialog.close(flag);
  }
}
