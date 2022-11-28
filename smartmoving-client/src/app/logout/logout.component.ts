import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../core/current-user.service';

@Component({
  selector: 'sm-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  constructor(
    private readonly currentUser: CurrentUserService,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.currentUser.logout();
      window.location.href = `/login`;
    });
  }
}
