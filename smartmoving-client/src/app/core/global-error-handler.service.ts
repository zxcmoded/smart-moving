import { Injectable, ErrorHandler, Injector } from '@angular/core';
import * as StackTrace from 'stacktrace-js';
import { EventAggregatorService } from './event-aggregator.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  private lastErrorMessage: string;

  constructor(
      private injector: Injector
  ) {
  }

  async handleError(error) {
    let errorString = '';
    if (error.toString) {
      errorString = error.toString();
    }

    if (!errorString || errorString.indexOf('[object') > -1) {
      try {
        errorString = JSON.stringify(error);
      } catch {
        errorString = 'Unknown error - unable to stringify';
      }
    }

    if (errorString.includes('ExpressionChangedAfterItHasBeenCheckedError')) {
      console.log('Handled ExpressionChangedAfterItHasBeenCheckedError error');
      return;
    }

    if (errorString.includes('"status":401')) {
      console.log('Handled 401 response error');
      return;
    }

    // Server side 400s already log error or info explicitly
    if (errorString.includes('"status":400')) {
      console.log('Handled 400 response error');
      return;
    }

    if (errorString.includes('Error: Loading chunk')) {
      const aggregator = this.injector.get(EventAggregatorService);
      aggregator.post('ChunkLoadFailed');
      return;
    }

    if (window.location.hostname === 'localhost') {
      throw error;
    }

    if (this.lastErrorMessage === errorString) {
      throw error;
    }
    this.lastErrorMessage = errorString;

    let stackTrace;

    if (error.stack) {
      stackTrace = error.stack;
    } else {
      const frames = await StackTrace.fromError(error);

      stackTrace = frames
          .splice(0, 10)
          .map(function (sf) {
            return sf.toString();
          }).join('\n');
    }

    if (this.isIgnoredError(errorString, stackTrace)) {
      console.log('Ignoring error: ', errorString);
      return;
    }

    throw error;
  }

  private isIgnoredError(errorMessage: string, stackTrace: string) {

    const ignoredErrors = [
      // We don't want to log errors from these libraries
      'js.intercomcdn.com',
      'analytics.churnzero.net',
      'js.upscope.io',
      'js.chargebee.com',
      // This is random JS crap that we can ignore
      'null is not an object (evaluating \'e.target.contentDocument.defaultView\')'
    ];

    if (ignoredErrors.some(x => errorMessage?.includes(x) || stackTrace?.includes(x))) {
      return true;
    }

    return false;
  }
}
