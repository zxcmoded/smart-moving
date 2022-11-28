import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, pluck, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventAggregatorService {

  subject: Subject<{eventName: string; payload: any}>;

  constructor() {
    this.subject = new Subject(); //
  }

  post(eventName: string, payload?: any): any {
    this.subject.next({ eventName, payload });
  }

  on(eventName: string) {
    return this.subject.pipe(
      filter(x => x.eventName === eventName),
      pluck('payload'),
      share()
    );
  }
}
