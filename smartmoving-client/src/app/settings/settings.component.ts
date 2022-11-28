import { Component } from '@angular/core';
import { Permission } from 'app/generated/SmartMoving/Core/Data/Security/permission';
import { CurrentUserService } from 'app/core/current-user.service';

export enum SettingsSections {
  CompanySettingsSection,
}

@Component({
  selector: 'sm-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent {

  constructor(readonly currentUser: CurrentUserService) {
  }

  activeSection: SettingsSections = null;

  sections = SettingsSections;

  Permission = Permission;

  sectionClicked(section: SettingsSections) {
    this.activeSection = this.activeSection === section ? null : section;
  }
}
