import { ControlValueAccessor } from '@angular/forms';

export const NOOP_VALUE_ACCESSOR: ControlValueAccessor = {
  writeValue: () => {
  },
  registerOnChange: () => {
  },
  registerOnTouched: () => {
  },
};
