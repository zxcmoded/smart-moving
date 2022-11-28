import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RouteHistoryService {
  private history: string[] = [];

  public addHistory(url: string) {
    this.history.push(url);
  }

  public getHistory() {
    return this.history;
  }

  public getPreviousUrl(skipLegacyRedirect = false) {
    if (this.history.length < 2) {
      return null;
    }

    let redirectTo = this.history[this.history.length - 2];

    // The route below now redirects to the "v1 accounting job list but in v2 skin" landing page.
    // If we put the user to this route, they'll end up just getting forwarded back to the page,
    // and not actually go back to the intended module. It puts the user in a loop.
    if (skipLegacyRedirect && redirectTo.includes('accounting/jobs/details')) {
      redirectTo = this.history[this.history.length - 3];
    }

    return redirectTo;
  }

  public getPossibleModuleNameFromUrl(url: string) {
    if (!url) {
      return '';
    }

    if (url.includes('follow')) {
      return 'Follow-ups';
    }

    if (url.includes('my-leads')) {
      return 'My Leads';
    }

    if (url.includes('accounting')) {
      return 'Accounting';
    }

    if (url.includes('reports')) {
      return 'Reports';
    }

    if (url.includes('accounting')) {
      return 'Accounting';
    }

    if (url.includes('customers')) {
      return 'Customers';
    }

    if (url.includes('customer')) {
      return 'Customer Service';
    }

    if (url.includes('calendar')) {
      return 'Calendar';
    }

    if (url.includes('trip')) {
      return 'Trips';
    }

    if (url.includes('dispatch')) {
      return 'Dispatch';
    }

    if (url.includes('task')) {
      return 'Tasks';
    }

    if (url.includes('storage')) {
      return 'Storage';
    }

    return '';
  }
}
