import { Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ApiClientService } from 'app/core/api-client.service';
import { getInitials } from 'app/core/get-initials.function';
import { isNullOrUndefined } from 'app/core/is-null-or-undefined';

export class PopoverOption {
  id?: string | boolean | number;
  disabled?: boolean;
  tooltipMessage?: string;
  initials?: string;
  optionClasses?: string;
  name?: string;
  count?: number;
  dontRecalculateDisplay?: boolean;
}

@Component({
  selector: 'sm-popover-editor',
  templateUrl: './popover-editor.component.html',
  styleUrls: ['./popover-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PopoverEditorComponent),
      multi: true
    }
  ]
})
export class PopoverEditorComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() label: string;
  @Input() showLabel = true;
  @Input() placeholder: string;
  @Input() dataSourceUri: string;
  @Input() blockedValues: string[] = [];
  @Input() data: PopoverOption[];
  @Input() valueProperty: string;
  @Input() popoverClass: string;
  @Input() displayProperty: string;
  @Input() width: string;
  @Input() maxWidth: string;
  @Input() height: string;
  @Input() maxHeight: string;
  @Input() disablePopover = false;
  @Input() showArrow = true;
  @Input() hideArrowOnDisabled = true;
  @Input() placement = 'bottom';
  @Input() initials = false;
  @Input() blankSelectionText: string;
  @Input() includeCurrentId = false;
  @Input() hideIfSingleOption = false;
  @Input() container = '';
  @Input() reloadFromDataSourceUriAsNeeded = false;
  @Input() searchable = false;
  @Input() defaultValueToShow: string;
  @Input() truncateDisplayLength = 9999;
  @Input() truncateOptionsDisplayLength = this.truncateDisplayLength;
  @Input() dataTestId;
  @Input() disabledTextClass;
  @Input() useFontWeightBold = true;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change = new EventEmitter<any>();
  @HostBinding('class.d-none') isHidden = false;

  propagateChange: (_: any) => void;
  propagateTouched: () => void;

  fullOptions: PopoverOption[];
  options: PopoverOption[];
  private lastIncludedId: string;

  currentValue = undefined;
  displayValue = null;

  finalDataTestId: string;

  searchControl = new UntypedFormControl('');

  constructor(
      private apiClient: ApiClientService
  ) {
  }

  ngOnInit() {
    if (this.dataSourceUri) {
      this.loadOptions().then();
    }

    this.finalDataTestId = this.dataTestId || this.label?.replace(/\s/g, '') || 'dataTestId' + Math.random().toString(36).substring(2);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.searchControl.setValue('');

    if (changes.data && changes.data.currentValue && !this.dataSourceUri) {
      this.fullOptions = this.data;
      this.options = this.data;
      this.recalculateDisplayedValue();
    }

    if (changes.blockedValues && this.fullOptions && this.fullOptions.length) {
      this.setFilteredOptions(this.fullOptions);
    }

    // This boolean in theory shouldn't be needed, but honestly, I don't trust this control
    // and wanted to only explicitly enable this functionality.
    if (changes.dataSourceUri && this.reloadFromDataSourceUriAsNeeded && this.propagateChange) {
      this.currentValue = '';
      this.propagateChange(this.currentValue);
      this.change.emit(this.currentValue);
      this.loadOptions().then();
      return;
    }
  }

  private setFilteredOptions(options: PopoverOption[]) {
    this.fullOptions = [...options];
    const filteredOptions = [...options];

    this.blockedValues.forEach(blocked => {
      const indexOfBlockedValue = filteredOptions.findIndex(o => o[this.valueProperty] === blocked);

      if (indexOfBlockedValue === -1) {
        return;
      }

      filteredOptions.splice(indexOfBlockedValue, 1);
    });

    this.options = filteredOptions;
  }

  private async loadOptions() {
    let url = this.dataSourceUri;

    if (this.includeCurrentId) {
      if (this.currentValue === undefined) {
        // Not ready yet!
        return;
      }
      this.lastIncludedId = this.currentValue;
      url += `?includeId=${this.currentValue || ''}`; // handle cases where currentValue is null
    }
    const options = await this.apiClient.get<PopoverOption[]>(url);

    if (options.length === 1 && this.hideIfSingleOption) {
      this.isHidden = true;
    }

    if (!isNullOrUndefined(this.blankSelectionText)) {
      const blankOption = {};
      blankOption[this.valueProperty ?? 'id'] = '';
      blankOption[this.displayProperty ?? 'name'] = this.blankSelectionText;
      options.splice(0, 0, blankOption);
    }

    if (this.initials) {
      options.forEach(x => x.initials = getInitials(this.getDisplayValue(x)));
    }

    this.setFilteredOptions(options);

    this.recalculateDisplayedValue();
  }

  private recalculateDisplayedValue() {
    if (this.currentValue === undefined || !this.options) {
      this.displayValue = 'Loading...';
    } else if (this.currentValue === null) {
      this.displayValue = this.placeholder;
    } else {
      let selectedValue = this.currentValue;

      if (this.valueProperty) {
        selectedValue = this.options.find(x => x[this.valueProperty] === this.currentValue);
      }

      if (this.displayProperty) {
        this.displayValue = selectedValue && selectedValue[this.displayProperty];
      } else {
        this.displayValue = selectedValue;
      }
    }
  }

  async writeValue(obj: any) {
    this.currentValue = obj;
    if (this.includeCurrentId && this.dataSourceUri && (!this.options || !this.options.length || this.lastIncludedId !== this.currentValue)) {
      await this.loadOptions();
    }

    this.recalculateDisplayedValue();
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.propagateTouched = fn;
  }

  setDisabledState?(isDisabled: boolean) {
    this.disablePopover = isDisabled;
  }

  makeSelection(option: PopoverOption) {
    if (this.valueProperty) {
      this.currentValue = option[this.valueProperty];
    } else {
      this.currentValue = option;
    }

    this.propagateChange(this.currentValue);
    this.change.emit(this.currentValue);
    if (!option.dontRecalculateDisplay) {
      this.recalculateDisplayedValue();
    }

    this.searchControl.setValue('');
  }

  getDisplayValue(option: PopoverOption) {
    if (this.displayProperty) {
      return option[this.displayProperty];
    }

    if (option.name !== undefined) {
      return option.name;
    }

    return option;
  }
}
