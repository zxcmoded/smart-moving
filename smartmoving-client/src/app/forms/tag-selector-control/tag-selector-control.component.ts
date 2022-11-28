import { Component, Input, forwardRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectListOption } from 'app/core/select-list-option';

export class SelectListWithSelected extends SelectListOption {
  selected = false;
}

@Component({
  selector: 'sm-tag-selector-control',
  templateUrl: './tag-selector-control.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagSelectorControlComponent),
      multi: true
    }
  ]
})
export class TagSelectorControlComponent implements ControlValueAccessor, OnChanges {
  @Input() tags: SelectListWithSelected[] = [];
  @Output() selectionMade = new EventEmitter();
  isDisabled = false;
  selected: string[] = [];

  propagateChange: (_: any) => {};
  touched: () => {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tags) {
      this.bindTags();
    }
  }

  changed() {
    this.selected = this.tags.filter(x => x.selected).map(x => x.name);
    this.propagateChange(this.selected);
  }

  writeValue(values: string[]) {
    this.selected = values;

    this.bindTags();
  }

  private bindTags() {
    if (!this.tags || !this.selected) {
      return;
    }

    this.tags.forEach(x => {
      x.selected = this.selected.includes(x.name);
    });
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.touched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  focused() {
    this.touched();
  }
}
