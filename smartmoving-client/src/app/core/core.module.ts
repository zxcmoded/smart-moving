import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgePipe } from './pipes/age.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { HumanizePipe } from './pipes/humanize.pipe';
import { JoinPipe } from './pipes/join.pipe';
import { PhoneNumberPipe } from './pipes/phone-number.pipe';
import { StopClickPropagationDirective } from './directives/stop-click-propagation.directive';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TimeOfDayPipe } from './pipes/time-of-day.pipe';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { HourOfDayPipe } from './pipes/hour-of-day.pipe';
import { HoursAndMinutesPipe } from './pipes/hours-and-minutes.pipe';
import { InitialsPipe } from './pipes/initials.pipe';
import { GoBackDirective } from './directives/go-back.directive';
import { HoursToAmPmPipe } from './pipes/hours-to-am-pm.pipe';
import { FormatMinutesPipe } from './pipes/format-minutes.pipe';
import { SmCurrencyPipe } from './pipes/sm-currency.pipe';
import { SmNumberPipe } from './pipes/sm-number.pipe';
import { SmPercentPipe } from './pipes/sm-percent.pipe';
import { PlainTextPipe } from './pipes/plain-text.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { EnsureHttpPrefixDirective } from './ensure-http-prefix.directive';
import { TruncatePipe } from './pipes/truncate.pipe';
import { AutoGrowDirective } from './auto-grow.directive';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { NoAutoCompleteDirective } from './no-auto-complete.directive';
import { ArraySortPipe } from './pipes/array-sort.pipe';
import { DashIfFalsyPipe } from './pipes/dash-if-falsy.pipe';
import { TableSortDirective } from './directives/table-sort.directive';
import { StripHtmlPipe } from './pipes/strip-html.pipe';
import { BytesPipe } from './pipes/bytes.pipe';
import { DigitsOnlyPipe } from './digits-only.pipe';
import { FormatPhoneNumberDirective } from './format-phone-number.directive';
import { RequiredLabelsDirective } from './directives/required-labels.directive';
import { HasPermissionDirective } from './auth/has-permission.directive';
import { SmHighPrecisionCurrencyPipe } from './pipes/high-precision-currency.pipe';
import { FeetInchesPipe } from './pipes/feet-inches.pipe';
import { DashIfNullUndefinedPipe } from 'app/core/pipes/dash-if-null-undefined.pipe';
import { HumanizeBetterPipe } from './pipes/humanize-better.pipe';
import { ScrollIntoViewDirective } from './directives/scroll-into-view.directive';
import { FormatTimespanPipe } from './pipes/format-timespan.pipe';
import { NgbTooltipEnableOnOverflowDirective } from './ngb-tooltip-enable-on-overflow.directive';
import { DaysHoursAndMinutesPipe } from 'app/core/pipes/days-hours-and-minutes.pipe';
import { CamelCasePipe } from 'app/core/pipes/camel-case.pipe';
import { ChildInputAutoFocusDirective } from 'app/core/directives/child-input-auto-focus.directive';
import { ReplaceTextPipe } from 'app/core/pipes/replace-text.pipe';
import { SentenceJoinPipe } from './pipes/sentence-join.pipe';
import { FormatAsSentencePipe } from 'app/core/pipes/format-as-sentence.pipe';
import { TruncateTextPipe } from './pipes/truncate-text.pipe';

const declarations = [
  HumanizePipe,
  HumanizeBetterPipe,
  PhoneNumberPipe,
  AgePipe,
  StopClickPropagationDirective,
  ClickOutsideDirective,
  JoinPipe,
  SentenceJoinPipe,
  TimeAgoPipe,
  HourOfDayPipe,
  TimeOfDayPipe,
  AutoFocusDirective,
  ChildInputAutoFocusDirective,
  HoursAndMinutesPipe,
  DaysHoursAndMinutesPipe,
  InitialsPipe,
  GoBackDirective,
  HoursToAmPmPipe,
  FormatMinutesPipe,
  SmCurrencyPipe,
  SmHighPrecisionCurrencyPipe,
  SmNumberPipe,
  SmPercentPipe,
  PlainTextPipe,
  SafeHtmlPipe,
  EnsureHttpPrefixDirective,
  TruncatePipe,
  AutoGrowDirective,
  SafeUrlPipe,
  NoAutoCompleteDirective,
  ArraySortPipe,
  HasPermissionDirective,
  DashIfFalsyPipe,
  TableSortDirective,
  StripHtmlPipe,
  BytesPipe,
  DigitsOnlyPipe,
  FormatPhoneNumberDirective,
  RequiredLabelsDirective,
  FeetInchesPipe,
  DashIfNullUndefinedPipe,
  ScrollIntoViewDirective,
  FormatTimespanPipe,
  NgbTooltipEnableOnOverflowDirective,
  CamelCasePipe,
  ReplaceTextPipe,
  FormatAsSentencePipe,
  TruncateTextPipe
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ...declarations,
  ],
  exports: [
    ...declarations
  ]
})
export class CoreModule {
  public static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule
    };
  }
}
