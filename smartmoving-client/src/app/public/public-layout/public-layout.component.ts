import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { untilComponentDestroyed } from '../../core/take-until-destroyed';

@Component({
  selector: 'sm-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  blueMode = false;

  constructor(router: Router) {
    router.events
    .pipe(
      untilComponentDestroyed(this),
      filter(event => event instanceof NavigationEnd),
    )
    .subscribe((event: NavigationEnd) => this.blueMode = event.url.endsWith('setting-up') || event.url.endsWith('expired'));
  }

  ngOnDestroy() {}

  ngOnInit() {
  }

}
