import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseControlComponent } from 'app/forms/base-control.component';

@Component({
  selector: 'sm-pseudo-input-control',
  templateUrl: './pseudo-input-control.component.html'
})
export class PseudoInputControlComponent implements OnInit, OnChanges {
  @HostBinding('class.is-custom-control') readonly isCustomControl = true;

  @Input() labelText = '';
  @Input() noMargin = false;

  @Input() dataTestId: string;
  finalDataTestId: string;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes) {
      return;
    }

    this.finalDataTestId = this.dataTestId ?? BaseControlComponent.generateDataTestId(this.labelText);
  }

}
