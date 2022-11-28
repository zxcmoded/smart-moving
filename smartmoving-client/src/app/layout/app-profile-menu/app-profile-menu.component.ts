import { Component, OnInit, OnDestroy } from '@angular/core';
import { CurrentUserService } from 'app/core/current-user.service';
import { getInitials } from 'app/core/get-initials.function';
import { Permission } from 'app/generated/SmartMoving/Core/Data/Security/permission';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'sm-app-profile-menu',
  templateUrl: './app-profile-menu.component.html',
  styleUrls: ['./app-profile-menu.component.scss']
})
export class AppProfileMenuComponent implements OnInit, OnDestroy {
  emailAddress: string;
  displayName: string;
  initials: string;
  isOpen = false;
  Permission = Permission;

  constructor(private readonly currentUser: CurrentUserService,
              private readonly matDialog: MatDialog) {
  }

  ngOnInit() {
    this.initials = getInitials(this.currentUser.instance.displayName);
    this.emailAddress = this.currentUser.instance.email;
    this.displayName = this.currentUser.instance.displayName;
  }

  ngOnDestroy() {
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
