import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiClientService } from 'app/core/api-client.service';

@Component({
  selector: 'sm-popover-selector',
  templateUrl: './popover-selector.component.html',
  styleUrls: ['./popover-selector.component.scss']
})
export class PopoverSelectorComponent implements OnInit {
  @Input() label: string;
  @Input() dataSourceUri: string;
  @Input() options: any[];
  @Input() valueProperty: string;
  @Input() displayProperty: string;
  @Input() popoverClass: string;
  @Input() width: string;
  @Input() height: string;
  @Input() disablePopover = false;
  @Input() placement = 'bottom';
  @Input() container: string;
  @Input() truncateDisplayLength = 9999;
  isLoading = true;

  // Emits an event of the selected value.
  @Output() change = new EventEmitter<any>();

  constructor(private readonly api: ApiClientService) { }

  async ngOnInit() {
    if (this.dataSourceUri && !this.options) {
      [this.options] = await this.api.getAll<any[]>([this.dataSourceUri]);
    }
    this.isLoading = false;
  }

  getOptionDisplayValue(option) {
    if (this.displayProperty) {
      return option[this.displayProperty];
    }

    if (option.name !== undefined) {
      return option.name;
    }

    return option;
  }
}
