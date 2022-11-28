import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectWrapperComponent } from './select-wrapper/select-wrapper.component';
import { Select2Directive } from './select2.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { PopoverEditorComponent } from './popover-editor/popover-editor.component';
import { NgbPopoverModule, NgbTimepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ValidationComponent } from './validation.component';
import { CoreModule } from '../core/core.module';
import { ClickToEditComponent } from './click-to-edit/click-to-edit.component';
import { TagSelectorControlComponent } from 'app/forms/tag-selector-control/tag-selector-control.component';
import { SearchDropdownComponent } from './search-dropdown/search-dropdown.component';
import { PopoverSelectorComponent } from './popover-selector/popover-selector.component';
import { SearchControlComponent } from './search-control/search-control.component';
import { InputTextControlComponent } from 'app/forms/input-text-control/input-text-control.component';
import { TextareaControlComponent } from './textarea-control/textarea-control.component';
import { CheckboxControlComponent } from './checkbox-control/checkbox-control.component';
import { FormClassApplicatorDirective } from './form-class-applicator.directive';
import { FormGroupClassApplicatorDirective } from './form-group-class-applicator.directive';
import { RadioControlComponent } from './radio-control/radio-control.component';
import { ColorControlComponent } from './color-control/color-control.component';
import { PseudoInputControlComponent } from './pseudo-input-control/pseudo-input-control.component';
import { SelectControlComponent } from './select-control/select-control.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { InputHelpTextComponent } from './input-help-text/input-help-text.component';
import { BaseControlComponent } from 'app/forms/base-control.component';
import { InputLabelComponent } from './input-label/input-label.component';
import { CheckboxListControlComponent } from './checkbox-list-control/checkbox-list-control.component';
import { TruncateTextComponent } from './truncate-text/truncate-text.component';

const declarations = [
  SelectWrapperComponent,
  Select2Directive,
  PopoverEditorComponent,
  ValidationComponent,
  ClickToEditComponent,
  TagSelectorControlComponent,
  SearchDropdownComponent,
  PopoverSelectorComponent,
  InputTextControlComponent,
  SearchControlComponent,
  TextareaControlComponent,
  CheckboxControlComponent,
  FormClassApplicatorDirective,
  FormGroupClassApplicatorDirective,
  RadioControlComponent,
  ColorControlComponent,
  PseudoInputControlComponent,
  SelectControlComponent,
  DatePickerComponent,
  BaseControlComponent,
  InputHelpTextComponent,
  InputLabelComponent,
  CheckboxListControlComponent,
  TruncateTextComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    NgbPopoverModule,
    CoreModule,
    NgbTimepickerModule,
    NgbTooltipModule,
    NgSelectModule,
  ],
  declarations: [
    ...declarations,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    ...declarations
  ]
})
export class SmartMovingFormsModule {}
