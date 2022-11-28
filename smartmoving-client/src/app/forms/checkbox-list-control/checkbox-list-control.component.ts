import { Component, Input, OnInit, EventEmitter, OnDestroy, Output } from '@angular/core';
import { trackById } from 'app/core/track-by-id.function';

export interface Selectable {
  isSelected: boolean;
  id: string;
}

@Component({
  selector: 'sm-checkbox-list-control',
  templateUrl: './checkbox-list-control.component.html'
})
export class CheckboxListControlComponent implements OnInit, OnDestroy {

  @Input() items: Selectable[];
  @Input() bindLabel = 'name';
  @Output() selectionChange: EventEmitter<Selectable> = new EventEmitter();

  @Input() rightMode = false;
  @Input() paddedBackground = false;
  @Input() noMargin = false;
  @Input() alignWithInputs = false;
  @Input() disabled = false;

  inputId = 'id' + Math.random().toString(36).substring(2);

  @Input() dataTestIdPrefix = 'checkboxList';

  trackById = trackById;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  toggleItem(item: Selectable) {

    if (this.disabled) {
      return;
    }

    item.isSelected = !item.isSelected;
    this.selectionChange.emit(item);
  }
}
