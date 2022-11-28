import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd, Data } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private defaultTitle = 'SmartMoving';
  private separator = ' - ';

  private titleFromRoutes: string[] = [];

  constructor(private readonly ngTitleService: Title,
              private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute) { }

  getTitleFromRoutes() {
    return this.titleFromRoutes;
  }

  prependTitle(...titlePrepend: string[]) {
    const prepend = titlePrepend.length ? `${titlePrepend.join(this.separator)}${this.separator}` : '';
    const fromTitle = this.titleFromRoutes.length ? `${this.titleFromRoutes.join(this.separator)}${this.separator}` : '';

    this.ngTitleService.setTitle(`${prepend}${fromTitle}${this.defaultTitle}`);
  }

  startRouteSubscription() {
    this.router.events.pipe(
          filter(event => event instanceof NavigationEnd),
          map(() => this.activatedRoute),
          map(route => {
            const dataSubs: Observable<Data>[] = [];
            while (route.firstChild) {
              dataSubs.push(route.data);
              route = route.firstChild;
            }
            dataSubs.push(route.data);
            return combineLatest(dataSubs.reverse());
          }),
          switchMap(x => x)
      )
      .subscribe(datum => {
        this.titleFromRoutes = datum.map(x => x['title'] as string).filter(x => x).reduce((prev, current) => {
          if (!prev.some(x => x === current)) {
            // Only append a title segment if it doesn't already exist. This is to take care of some cases where
            // the routes are laid out in such a way where a parent title gets inherited through 2-3 levels.
            // This way we can add titles without having to refactor our routing structure in those areas.
            prev.push(current);
          }
          return prev;
        }, [] as string[]);
        this.prependTitle();
      });
  }
}
