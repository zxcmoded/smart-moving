import { Component, OnDestroy, OnInit } from '@angular/core';
import { HideLayoutElementsService } from 'app/core/hide-layout-elements.service';
import { untilComponentDestroyed } from 'app/core/take-until-destroyed';

@Component({
  selector: 'sm-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  hideHeader = false;
  hideMenu = false;

  constructor(
    private readonly hideLayout: HideLayoutElementsService,
  ) {
    this.hideLayout.hideHeaderChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(x => this.hideHeader = x);

    this.hideLayout.hideMenuChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(x => this.hideMenu = x);
  }

  ngOnInit() {}

  ngOnDestroy() {}

}
