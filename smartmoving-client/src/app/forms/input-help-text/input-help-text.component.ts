import { Component, Input } from '@angular/core';
import { BaseControlComponent } from 'app/forms/base-control.component';

@Component({
  selector: 'sm-input-help-text',
  templateUrl: './input-help-text.component.html'
})
export class InputHelpTextComponent {

  @Input() control: BaseControlComponent;

  constructor() { }
}
