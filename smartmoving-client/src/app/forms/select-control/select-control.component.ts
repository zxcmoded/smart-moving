import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { untilComponentDestroyed } from 'app/core/take-until-destroyed';
import { ApiClientService } from 'app/core/api-client.service';
import { concat, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { trackById } from 'app/core/track-by-id.function';
import { SelectListOption } from 'app/generated/Common/select-list-option';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BaseControlComponent } from 'app/forms/base-control.component';

@Component({
  selector: 'sm-select-control',
  templateUrl: './select-control.component.html',
  styleUrls: ['./select-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectControlComponent),
      multi: true
    }
  ]
})
export class SelectControlComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit, ControlValueAccessor {
  @ViewChild('ngSelectElement') ngSelectComponent: NgSelectComponent;
  @Input() inputId = 'id' + Math.random().toString(36).substring(2);
  @Input() inputName: string;
  @Input() labelText: string;
  @Input() placeholder: string;
  @Input() isRequired = false;
  @Input() noMargin = false;

  @Input() displayNgContentOnEmptyResults = false;
  showNgContent = false;

  @Input() bindLabel = 'name';
  @Input() bindValue = 'id';
  @Input() options: any[];
  @Input() disabledOptionIds: any[];
  @Input() newOptions = new EventEmitter<SelectListOption[]>();
  @Input() trackByFn = (item: any) => trackById(null, item.id);
  @Input() appendTo: string;
  @Input() isOpen = null;

  @Input() dataTestId: string;
  finalDataTestId: string;

  isLoaded = false;
  @Input() itemProviderRoute: string;

  @Input() isSearchable = true;
  @Input() isClearable = true;

  // For server-backed searching
  static searchTermPlaceholder = '{searchTerm}';
  searchInput$: Subject<string> = new Subject<string>();
  items$: Observable<any[]>;
  @Input() serverSearch = false;
  @Input() minSearchTermLength: number;
  @Input() serverSearchDebounceTime = 0;
  @Input() unwrapSearchResults = (items: any) => items;
  @Input() typeToSearchText: string;

  @Input() optionTemplateRef: TemplateRef<any>;
  @Input() optionalLabelTemplateRef: TemplateRef<any>;
  @Input() optionsPanelWide = false;
  @Input() optionsPanelUltraWide = false;

  // Does not work with server-side search.
  @Input() defaultToFirstValue = false;

  @Output() selectionChanged = new EventEmitter<any>();
  @Output() clearEvent = new EventEmitter<any>();
  @Output() searchEvent = new EventEmitter<string>();
  @Output() blurEvent = new EventEmitter<any>();

  @Input() labelActionTemplateRef: TemplateRef<any>;

  showLabel: boolean;
  finalInputName: string;
  optionsWidthCssClass: string;

  formControl = new UntypedFormControl();
  propagateChange: (_: any) => unknown;
  propagateTouched: () => unknown;

  // Needed for the label control
  get isRequiredControl() {
    return this.isRequired;
  }

  constructor(private readonly api: ApiClientService) {
  }

  ngOnDestroy() {
  }

  async ngOnInit() {
    this.formControl.valueChanges
        .pipe(untilComponentDestroyed(this))
        .subscribe((value: string) => {
          if (this.propagateTouched) {
            this.propagateTouched();
          }
          if (this.propagateChange) {
            this.propagateChange(value);
          }
        });

    if (this.itemProviderRoute && !this.serverSearch) {
      let [serverOptions] = await this.api.getAll<[any[]]>([this.itemProviderRoute]);

      if (this.defaultToFirstValue && serverOptions.length) {
        this.formControl.setValue(serverOptions[0][this.bindValue], { emitEvent: true });
      }

      if (this.disabledOptionIds) {
        serverOptions = serverOptions.map(x => ({...x, disabled: this.disabledOptionIds.some(d => x[this.bindValue] === d)}));
      }

      this.items$ = of(serverOptions);
      this.loadingFinished(serverOptions.length);
      return;
    }

    if (!this.serverSearch) {
      // for static options
      this.items$ = of(this.options?.map(x => ({...x, disabled: this.disabledOptionIds?.some(d => x[this.bindValue] === d) ?? false})));

      this.newOptions.subscribe((opt: SelectListOption[]) => {
        this.options = opt;
        this.items$ = of(this.options);
      });

      this.loadingFinished(this.options?.length ?? 0);

      if (this.options?.length && this.defaultToFirstValue) {
        this.formControl.setValue(this.options[0][this.bindValue], { emitEvent: true });
      }

      return;
    }

    if (this.serverSearch) {
      this.typeToSearchText = this.typeToSearchText ?? `Enter ${this.minSearchTermLength} characters to search`;
      this.items$ = concat(
          of([]),
          this.searchInput$.pipe(
              distinctUntilChanged(),
              debounceTime(this.serverSearchDebounceTime),
              tap(() => this.isLoaded = false),
              switchMap(async term => {
                    const url = this.itemProviderRoute.replace(SelectControlComponent.searchTermPlaceholder, term);
                    const [results] = await this.api.getAll<[any[]]>([url]);
                    this.loadingFinished(results.length);
                    return this.unwrapSearchResults(results);
                  }
              )
          )
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes) {
      return;
    }

    this.placeholder = this.placeholder ?? this.labelText;
    this.finalInputName = this.inputName ?? this.inputId;
    this.showLabel = !!this.labelText;
    this.optionsWidthCssClass = this.optionsPanelWide ? 'sm-select-control-wide' :
        this.optionsPanelUltraWide ? 'sm-select-control-ultra-wide' : null;

    this.formControl.clearValidators();
    if (this.isRequired) {
      this.formControl.setValidators([Validators.required]);
    }

    this.finalDataTestId = this.dataTestId ?? BaseControlComponent.generateDataTestId(this.labelText);
  }

  onBlur() {
    this.blurEvent.emit();

    if (this.formControl.value === null) {
      this.formControl.setValue(null);
      this.formControl.markAsTouched();
    }
  }

  loadingFinished(optionsLength: number) {
    this.isLoaded = true;
    this.showNgContent = this.displayNgContentOnEmptyResults && optionsLength < 1;
  }

  selectionChangedInternal($event: any) {
    this.selectionChanged.emit($event);
  }

  closed() {
    this.propagateTouched();
  }

  writeValue(value: string) {
    this.formControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.propagateTouched = fn;
  }

  setDisabledState(isDisabled) {
    if (isDisabled) {
      this.formControl.disable({ emitEvent: false });
    } else {
      this.formControl.enable({ emitEvent: false });
    }
  }

  ngAfterViewInit() {
    // MEGA SKETCH hack to kill autocomplete in chromium
    this.ngSelectComponent?.element?.getElementsByTagName('input')[0]?.setAttribute('autocomplete', 'new-password');
  }
}
