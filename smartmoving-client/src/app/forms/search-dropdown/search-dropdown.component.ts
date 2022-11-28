import { Component, OnInit, Input, forwardRef, EventEmitter, Output, ContentChild, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'sm-search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchDropdownComponent),
      multi: true
    }
  ]
})
export class SearchDropdownComponent implements OnInit {
  propagateChange: (_: any) => Record<string, unknown>;
  propagateTouched: () => Record<string, unknown>;
  @Input() results: any[];
  @Input() formKey;
  @Input() noResultsMessage;
  @Input() resultWrapperClass = '';
  @Output() searchTermUpdate: EventEmitter<string> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() clearResults: EventEmitter<any> = new EventEmitter();
  @ContentChild(TemplateRef, { static: true }) parentTemplate: TemplateRef<any>;
  @ViewChild('searchDropdownInputEl') searchDropdownInput: ElementRef;

  searchControl: UntypedFormControl;
  selectedResult;
  searchResults = false;

  constructor(
    private formBuilder: UntypedFormBuilder
  ) {
  }

  ngOnInit() {
    this.searchControl = this.formBuilder.control('', Validators.minLength(3));
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        filter(() => this.searchControl.valid),
      )
      .subscribe(query => {
        if (query && query.length) {
          this.searchTermUpdate.emit(query);
        } else {
          this.clearResults.emit();
        }
        this.searchResults = true;
      });
  }

  writeValue(): void {
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  makeSelection(result) {
    if (result) {
      this.selectedResult = result;
      const control = this.formKey ? result[this.formKey] : result;

      if (this.propagateChange) {
        this.propagateChange(control);
      }

      if (this.propagateTouched) {
        this.propagateTouched();
      }

      this.selected.emit(control);
      this.clear();
    }
  }

  clear() {
    this.searchControl.reset('');
    this.searchResults = false;
    this.clearResults.emit();
  }

  focusInput() {
    // have to use name here since smAutoComplete overwrites the id
    const el = document.getElementsByName('searchDropdownInputEl')[0];
    el.focus({ preventScroll: true });
  }
}
