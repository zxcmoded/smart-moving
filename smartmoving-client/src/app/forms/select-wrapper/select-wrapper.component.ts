/// <reference path="../../../../node_modules/@types/select2/index.d.ts" />

import { AfterContentInit, Component, ElementRef, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ApiClientService } from 'app/core/api-client.service';
import { SelectListOption } from 'app/generated/Common/select-list-option';

/***

 Example, including binding the ID property in such a way so that it doesn't generate multiple elements with the same ID.
 <sm-select-wrapper formControlName="type" itemProviderRoute="select-lists/user-types/{{type}}" placeholder="Role" [id]="'type'"></sm-select-wrapper>

 ***/
@Component({
  selector: 'sm-select-wrapper',
  templateUrl: './select-wrapper.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectWrapperComponent),
    multi: true
  }]
})
export class SelectWrapperComponent implements AfterContentInit, ControlValueAccessor {
  selectControl: JQuery<HTMLElement>;
  propagateChange: (_: any) => Record<string, unknown>;
  loaded = false;
  itemProviderRoute: string;
  isLoaded: Promise<void | Record<string, unknown>>;
  loadResolver: (value?: Record<string, unknown> | PromiseLike<Record<string, unknown>>) => void;
  hide = false;

  @Input() displayNgContentOnEmptyResults = false;
  @Input() id: string;
  @Input() name: string;
  @Input() placeholder: string;
  @Input() options: SelectListOption[];
  @Input() filter: string[] = [];
  @Input() filterKey: string;
  @Input() width: string;
  @Input() ajaxLookupUrl: string;
  @Input() token: string;
  @Input() enableSearch: boolean;
  @Input() blankSelectionText: string;
  @Input() label: string;
  @Input() showLabel = true;
  @Input() hideIfNoOptions = false;
  @Input() isRequired = false;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('itemProviderRoute')
  set itemProviderRouteSet(value: string) {
    this.itemProviderRoute = value;
    this.reloadItemsFromProvider();
  }

  @Input() includeId?: string;

  @Output() selected = new EventEmitter();
  @Output() selectedOption = new EventEmitter();
  @Output() loadingFinished = new EventEmitter();

  constructor(
      private element: ElementRef,
      private apiClient: ApiClientService
  ) {
    this.isLoaded = new Promise(resolver => this.loadResolver = resolver).then(_ => {
      this.loaded = true;
      this.loadingFinished.emit();
    });
  }

  async writeValue(value: any) {
    if (value !== undefined && value !== null) {
      await this.isLoaded;
      this.selectControl.val(value).trigger('change');
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  async ngAfterContentInit() {
    const options: Select2Options = {
      placeholder: this.placeholder || 'Please select one...',
      minimumResultsForSearch: !this.enableSearch ? -1 : 1,
      width: this.width || '100%'
    };

    if (this.ajaxLookupUrl) {
      options.ajax = {};
      options.minimumInputLength = 2;
      options.ajax.url = this.ajaxLookupUrl;
      options.ajax.headers = {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      };
      options.ajax.data = params => ({ query: params.term });
      options.ajax.processResults = data => ({
        results: data.map(x => ({ id: x.id, text: x.name }))
      });
    }

    this.selectControl = $('.select-basic', this.element.nativeElement).select2(options);

    this.selectControl.on('select2:select', (e: any) => {
      if (this.propagateChange) {
        let value = e.params.data.id;
        if (value === 'null') {
          value = null;
        }
        this.propagateChange(value);
        this.selected.emit(value);
        this.selectedOption.emit({
          id: value,
          name: e.params.data?.text ?? '',
        } as SelectListOption);
      }
    });

    if (this.options) {
      for (const opt of this.options) {
        const option = new Option(opt.name, opt.id, false, false);
        this.selectControl.append(option);
      }
      this.selectControl.trigger('change');
      this.loadResolver();
    }

    if (this.ajaxLookupUrl) {
      this.loadResolver();
    }

    if (this.itemProviderRoute) {
      await this.reloadItemsFromProvider();
      this.loadResolver();
    }
  }

  private async reloadItemsFromProvider() {
    if (!this.selectControl || !this.itemProviderRoute) {
      return;
    }

    let url = this.itemProviderRoute;

    if (this.includeId) {
      if (url.indexOf('?') > 1) {
        url = `${url}&includeId=${this.includeId}`;
      } else {
        url = `${url}?includeId=${this.includeId}`;
      }
    }

    const results = await this.apiClient.get<SelectListOption[]>(url);

    this.selectControl.children().slice(1).remove();

    this.options = results;

    if (this.filter && this.filterKey && Array.isArray(this.filter)) {
      this.options = results.filter(result => this.filter.includes(result[this.filterKey]));
    }

    this.hide = !this.options.length && this.hideIfNoOptions;

    if (this.blankSelectionText) {
      this.selectControl.append(new Option(this.blankSelectionText, null, true, true));
    }

    for (const opt of this.options) {
      const option = new Option(opt.name, opt.id, false, false);
      this.selectControl.append(option);
    }

    this.selectControl.trigger('change');
  }
}
