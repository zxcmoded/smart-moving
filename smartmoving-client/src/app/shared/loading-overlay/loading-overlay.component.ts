import { Component, Input } from '@angular/core';

@Component({
  selector: 'sm-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss']
})
export class LoadingOverlayComponent {
  @Input() smallMode = false;
  @Input() showTopGrower = true;
}
