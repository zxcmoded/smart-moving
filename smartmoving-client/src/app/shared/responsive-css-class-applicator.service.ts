import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveCssClassApplicatorService {

  isResponsive: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }
}
