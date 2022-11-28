import { Component, OnInit, ViewChild, TemplateRef, Renderer2, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import * as moment from 'moment';
import { EventAggregatorService } from './core/event-aggregator.service';
import { TitleService } from './shared/title.service';
import { LocalStorageKeys } from 'app/shared/local-storage-keys';
import { AuthenticationService } from './core/authentication.service';
import { CurrentUserService } from './core/current-user.service';
import { RouteHistoryService } from 'app/core/route-history.service';
import { ResponsiveCssClassApplicatorService } from 'app/shared/responsive-css-class-applicator.service';
import { untilComponentDestroyed } from 'app/core/take-until-destroyed';

@Component({
  selector: 'sm-root',
  templateUrl: './app.component.html',
  providers: [NgbPopoverConfig, NgbTooltipConfig]
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('updateRequiredModal', { static: true }) updateRequiredModal: TemplateRef<any>;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly router: Router,
              private readonly notifications: NotificationsService,
              private readonly eventAggregator: EventAggregatorService,
              private readonly matDialog: MatDialog,
              private readonly popoverConfig: NgbPopoverConfig,
              private readonly tooltipConfig: NgbTooltipConfig,
              private readonly titleService: TitleService,
              private readonly authenticationService: AuthenticationService,
              private readonly currentUser: CurrentUserService,
              private readonly routeHistory: RouteHistoryService,
              private readonly renderer: Renderer2,
              private readonly responsive: ResponsiveCssClassApplicatorService) {

    this.setGlobalPopoverConfig();
    this.setGlobalTooltipConfig();

    (moment as any).updateLocale('en', {
      relativeTime: {
        m: '1 minute'
      }
    });

    // listen for changes to local storage to handle logout globally
    window.addEventListener('storage', this.handleLocalStorageChangesForLoginLogout, false);

    let lastBodyClassApplied = '';

    this.router.events.subscribe((event: Event) => {

      if (event instanceof NavigationEnd) {
        this.updateActiveModule();

        let currentRoute = this.activatedRoute.snapshot;

        let newBodyClass = null;
        let isResponsive = true;

        if (lastBodyClassApplied) {
          this.renderer.removeClass(document.body, lastBodyClassApplied);
        }

        while (currentRoute != null) {
          if (currentRoute.data.bodyClass) {
            newBodyClass = currentRoute.data.bodyClass;
          }

          if (currentRoute.data.notResponsive) {
            isResponsive = false;
          }

          currentRoute = currentRoute.firstChild;
        }

        if (newBodyClass) {
          lastBodyClassApplied = newBodyClass;
          this.renderer.addClass(document.body, lastBodyClassApplied);
        }

        if (!isResponsive) {
          this.renderer.addClass(document.documentElement, 'non-responsive');
        } else {
          this.renderer.removeClass(document.documentElement, 'non-responsive');
        }

        this.routeHistory.addHistory(event.url);
      }
    });
  }

  ngOnDestroy() {
  }

  async ngOnInit() {
    this.responsive.isResponsive
        .pipe(untilComponentDestroyed(this))
        .subscribe(isResponsive => {
          // We have some pages that dynamically need to change this.
          if (!isResponsive) {
            this.renderer.addClass(document.documentElement, 'non-responsive');
          } else {
            this.renderer.removeClass(document.documentElement, 'non-responsive');
          }
        });

    this.titleService.startRouteSubscription();

    this.setAutoLogout();
  }

  private setAutoLogout() {
    if (this.currentUser.isAuthenticated()) {
      this.authenticationService.setAutomaticLogoutInterval();
    }
  }

  private handleLocalStorageChangesForLoginLogout(event) {
    if (event.key === LocalStorageKeys.CURRENT_USER) {
      // just a little bit of insurance to give the initiator a chance to fire off the necessary logout/login functions
      setTimeout(() => {
        window.location.href = '/';
        // probably not completely necessary, but without this, there are times that our employees could have a split session due to sessionStorage values
        sessionStorage.clear();
      }, 1000);
    }
  };

  private updateActiveModule() {
    let currentRoute = this.activatedRoute.snapshot;

    let moduleName = 'Default';

    while (currentRoute != null) {
      if (currentRoute.data.moduleName) {
        moduleName = currentRoute.data.moduleName;
      }
      currentRoute = currentRoute.firstChild;
    }

  }

  reload() {
    window.location.href = '/';
  }

  private setGlobalPopoverConfig() {
    this.popoverConfig.autoClose = false;
    this.popoverConfig.animation = false; // why would they default this to on? It's terrible
  }

  private setGlobalTooltipConfig() {
    this.tooltipConfig.openDelay = 350;
  }
}
