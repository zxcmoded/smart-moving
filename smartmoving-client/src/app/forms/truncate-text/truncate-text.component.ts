import { Component, Input, OnInit } from '@angular/core';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';

@Component({
  selector: 'sm-truncate-text',
  templateUrl: './truncate-text.component.html'
})
export class TruncateTextComponent implements OnInit {

  @Input() text: string;
  // when using innerHtmlText (for html encoded/formatted text, be sure to provide non formatted text for the tooltip
  @Input() innerHtmlText: string;
  @Input() tooltipText: string;
  @Input() tooltipPlacement: PlacementArray = 'auto';
  @Input() appendToBody = false;
  @Input() isInTableCell = false;

  constructor() {
  }

  ngOnInit() {
  }

}
