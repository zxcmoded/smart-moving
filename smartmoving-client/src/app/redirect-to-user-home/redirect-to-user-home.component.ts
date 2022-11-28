import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from 'app/core/current-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sm-redirect-to-user-home',
  template: '<p>Redirecting...</p>'
})
export class RedirectToUserHomeComponent implements OnInit {

  constructor(
    private currentUser: CurrentUserService,
    private router: Router
  ) { }

  ngOnInit() {
    setTimeout(() => {
      let route = this.currentUser.getDefaultRoute();

      if (!route) {
        route = 'home';
      }
      this.router.navigateByUrl(route);
    });
  }

}
