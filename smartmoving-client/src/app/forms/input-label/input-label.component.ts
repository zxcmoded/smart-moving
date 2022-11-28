import { Component, Input, TemplateRef } from '@angular/core';
import { BaseControlComponent } from 'app/forms/base-control.component';

interface ControlLikeObject {
  inputId: string;
  showLabel: boolean;
  labelExtraCss?: string;
  labelTemplateRef?: TemplateRef<any>;
  labelText: string;
  isRequiredControl?: boolean;
}

@Component({
  selector: 'sm-input-label',
  templateUrl: './input-label.component.html'
})
export class InputLabelComponent {

  @Input() control: ControlLikeObject;
  @Input() labelRowEndContent: TemplateRef<any>;
  @Input() showRequiredAsterisk = true;
  @Input() blockLabelClick = false;

  constructor() {
  }

  handleClick(event) {
    if (this.blockLabelClick) {
      event?.preventDefault?.();
    }
  }

}
