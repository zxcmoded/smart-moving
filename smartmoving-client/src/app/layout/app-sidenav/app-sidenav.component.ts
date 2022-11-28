import { Component, OnInit } from '@angular/core';
import { Permission } from 'app/generated/SmartMoving/Core/Data/Security/permission';

@Component({
  selector: 'sm-app-sidenav',
  templateUrl: './app-sidenav.component.html',
  styleUrls: ['./app-sidenav.component.scss']
})
export class AppSidenavComponent implements OnInit {
  Permission = Permission;

  constructor() { }

  ngOnInit() {
  }
}
