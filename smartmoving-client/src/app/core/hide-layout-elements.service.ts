import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HideLayoutElementsService {
  hideHeaderChanged = new EventEmitter<boolean>();
  hideMenuChanged = new EventEmitter<boolean>();

  constructor() { }

  hideHeader() {
    this.hideHeaderChanged.emit(true);
  }

  hideMenu() {
    this.hideMenuChanged.emit(true);
  }
}
