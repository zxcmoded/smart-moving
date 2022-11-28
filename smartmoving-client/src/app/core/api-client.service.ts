import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { environment } from 'environments/environment';
import { CurrentUserService } from './current-user.service';
import { retryWhen, delay, concatMap } from 'rxjs/operators';
import { Observable, of, throwError, iif } from 'rxjs';
import { getErrorInfo } from 'app/core/get-error-info.function';

const cachedUrls = [
  'companies/current/map-settings',
  'companies/current/dispatch-settings',
  'reports/all-jobs',
  'settings/referral-sources/lookup',
  'leads/most-recent',
  'inbox/unread-count',
];

const cachedStartOfUrls = [
  'select-lists/',
  'company/dashboard/',
  'features/has-access-to'
];

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  constructor(
      private httpClient: HttpClient,
      private currentUser: CurrentUserService,
      private notifications: NotificationsService
  ) {
  }

  private getUrl(url: string) {
    let finalUrl = url.startsWith('/') ? url.substring(1) : url;

    const cacheBust = cachedUrls.findIndex(x => x === finalUrl) !== -1 ||
        cachedStartOfUrls.findIndex(x => finalUrl.startsWith(x)) !== -1;

    if (cacheBust) {
      if (finalUrl.indexOf('?') === -1) {
        finalUrl += `?cacheBust=${this.currentUser.cacheBustValue}`;
      } else {
        finalUrl += `&cacheBust=${this.currentUser.cacheBustValue}`;
      }
    }

    return `${environment.apiUrl}/${finalUrl}`;
  }

  private buildHeaders(headers: | HttpHeaders | { [header: string]: string | string[] }) {

    let normalizedHeaders: HttpHeaders;

    if (!headers) {
      normalizedHeaders = new HttpHeaders();
    } else if (headers instanceof HttpHeaders) {
      normalizedHeaders = headers;
    } else {
      normalizedHeaders = new HttpHeaders(headers);
    }

    if (this.currentUser.isAuthenticated()) {
      normalizedHeaders = normalizedHeaders.set('Authorization', `Bearer ${this.currentUser.instance.token}`);
    }

    return normalizedHeaders;
  }

  private standardRetryPolicy(errors: Observable<any>, noRetry?: boolean) {
    return errors.pipe(
        // tap(e => console.log('EXECUTING RETRY: ', e)),
        concatMap((e, i) =>
            iif(
                // Retry 5 times, but only if there is no HTTP status code.
                () => i > 5 || e.status || noRetry === true,
                // If the condition is true we throw the error (the last error)
                throwError(e),
                // Otherwise we pipe this back into our stream and delay the retry
                of(e).pipe(delay(1000))
            )
        )
    );
  }

  public delete<T>(url: string, body?: any) {
    const options = {
      headers: this.buildHeaders(null),
      body
    };

    return this.httpClient.delete<T>(this.getUrl(url), options)
        .pipe(retryWhen(x => this.standardRetryPolicy(x)))
        .toPromise();
  }

  public async deleteAll<T extends Array<any>>(urls: { url: string; body?: any }[],
                                               setBusyFunction?: (value: boolean) => void,
                                               successOptions?: { title?: string; message?: string },
                                               resetCache = false) {
    setBusyFunction = setBusyFunction || (_ => {
    });
    setBusyFunction(true);

    try {
      const calls = [];

      for (const item of urls) {
        calls.push(this.delete(item.url, item.body));
      }

      const result = await Promise.all(calls) as T;

      if (successOptions) {
        this.notifications.success(successOptions.title ? successOptions.title : 'Success!',
            successOptions.message ? successOptions.message : 'Successfully deleted!');
      }

      if (resetCache) {
        this.currentUser.resetCacheBust();
      }

      return result;
    } catch (error) {
      this.notifications.error('Oops!', getErrorInfo(error));
      throw error;
    } finally {
      setBusyFunction(false);
    }
  }

  public post<T>(
      url: string,
      body: any | null,
      options?: {
        headers?:
            | HttpHeaders
            | {
          [header: string]: string | string[];
        };
        observe?: 'body';
        params?:
            | HttpParams
            | {
          [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      }
  ) {
    options = options || {};
    options.headers = this.buildHeaders(options.headers);
    return this.httpClient.post<T>(this.getUrl(url), body, options)
        .pipe(retryWhen(x => this.standardRetryPolicy(x)))
        .toPromise();
  }

  public async postAll<T extends Array<any>>(urls: { url: string; body: any | null }[],
                                             setBusyFunction?: (value: boolean) => void,
                                             successOptions?: { title?: string; message?: string },
                                             resetCache = false,
                                             showErrorNotification = true) {
    setBusyFunction = setBusyFunction || (_ => {
    });
    setBusyFunction(true);

    try {
      const calls = [];

      for (const item of urls) {
        calls.push(this.post(item.url, item.body));
      }

      const result = await Promise.all(calls) as T;

      if (successOptions) {
        this.notifications.success(successOptions.title ? successOptions.title : 'Success!',
            successOptions.message ? successOptions.message : 'Successfully added!');
      }

      if (resetCache) {
        this.currentUser.resetCacheBust();
      }

      return result;
    } catch (error) {
      if (showErrorNotification) {
        this.notifications.error('Oops!', getErrorInfo(error));
      }
      throw error;
    } finally {
      setBusyFunction(false);
    }
  }

  public get<T>(
      url: string,
      options?: {
        headers?: HttpHeaders | {
          [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
          [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
        noRetry?: boolean;
      }) {
    options = options || {};
    options.headers = this.buildHeaders(options.headers);
    return this.httpClient.get<T>(this.getUrl(url), options)
        .pipe(retryWhen(x => this.standardRetryPolicy(x, options.noRetry)))
        .toPromise();
  }

  public async getAll<T extends Array<any>>(urls: string[],
                                            setBusyFunction?: (value: boolean) => void,
                                            successOptions?: { title?: string; message?: string }) {
    setBusyFunction = setBusyFunction || (_ => {
    });
    setBusyFunction(true);

    try {
      const calls = [];

      for (const item of urls) {
        calls.push(this.get(item));
      }

      const result = await Promise.all(calls) as T;

      if (successOptions) {
        this.notifications.success(successOptions.title ? successOptions.title : 'Success!',
            successOptions.message ? successOptions.message : 'Successfully retrieved!');
      }

      return result;
    } catch (error) {
      this.notifications.error('Oops!', getErrorInfo(error));
      throw error;
    } finally {
      setBusyFunction(false);
    }
  }

  public put<T>(
      url: string,
      body: any | null,
      options?: {
        headers?: HttpHeaders | {
          [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
          [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
      }) {
    options = options || {};
    options.headers = this.buildHeaders(options.headers);
    return this.httpClient.put<T>(this.getUrl(url), body, options)
        .pipe(retryWhen(x => this.standardRetryPolicy(x)))
        .toPromise();
  }

  public async putAll<T extends Array<any>>(urls: { url: string; body: any | null }[],
                                            setBusyFunction?: (value: boolean) => void,
                                            successOptions?: { title?: string; message?: string },
                                            resetCache = false) {
    setBusyFunction = setBusyFunction || (_ => {
    });
    setBusyFunction(true);

    try {
      const calls = [];

      for (const item of urls) {
        calls.push(this.put(item.url, item.body));
      }

      const result = await Promise.all(calls) as T;

      if (successOptions) {
        this.notifications.success(successOptions.title ? successOptions.title : 'Success!',
            successOptions.message ? successOptions.message : 'Successfully updated!');
      }

      if (resetCache) {
        this.currentUser.resetCacheBust();
      }

      return result;
    } catch (error) {
      this.notifications.error('Oops!', getErrorInfo(error));
      throw error;
    } finally {
      setBusyFunction(false);
    }
  }

  // Please know what you're doing.
  dynamicallyCall(method: string, url: string, body: any) {
    return this[method](url, body);
  }

  // The main usage of this is to upsert for records.
  public putOrPostAll<T extends Array<any>>(
      usePost: boolean,
      urls: { url: string; body: any | null }[],
      setBusyFunction?: (value: boolean) => void,
      successOptions?: { title?: string; message?: string },
      resetCache = false): Promise<T> {
    return usePost ?
        this.postAll(urls, setBusyFunction, successOptions, resetCache) :
        this.putAll(urls, setBusyFunction, successOptions, resetCache);
  }

  public async downloadReportAsPost(url: string, body: any) {
    return this.httpClient.post(this.getUrl(url), body, {
      responseType: 'blob',
      headers: this.buildHeaders({}),
    }).toPromise();
  }
}
