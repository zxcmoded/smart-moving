import { Directive, HostListener, Input, ElementRef, EventEmitter, Output } from '@angular/core';

/*
Example:  [(smTableSort)]="currentSort" column="jobNumber"

currentSort is the sorting string property on the component that's passed into the arraySort pipe.

column is the name of the property on the objects that are being sorted

Full Example:

<table class="table">
  <thead>
    <tr>
      <th scope="col" [(smTableSort)]="currentSort" column="col1">Col 1</th>
      <th scope="col" [(smTableSort)]="currentSort" column="col2">Col 2</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let widget of widgets | arraySort:currentSort">
      <td>{{ widget.col1  }}</td>
      <td>{{ widget.col2  }}</td>
    </tr>
  </tbody>
</table>
*/

@Directive({
  selector: '[smTableSort]'
})
export class TableSortDirective {
  private _smTableSort: string;
  get smTableSort() {
    return this._smTableSort;
  }
  @Input() set smTableSort(smTableSort: string) {
    if (this._smTableSort !== smTableSort) {
      this._smTableSort = smTableSort;
      this.setClasses();
    }
  }

  @Output() smTableSortChange = new EventEmitter<string>();

  @Input() column: string;

  constructor(private readonly el: ElementRef) {
    this.el.nativeElement.classList.add('th-sortable');
   }

  @HostListener('click', ['$event'])
  public onClick() {
    this.sort();
  }

  sort() {
    let direction = '+';

    if (this.smTableSort && this.smTableSort.length > 1 && this.smTableSort.slice(1) === this.column) {
      direction = this.smTableSort[0] === '+' ? '-' : '+';
    }

    this.smTableSort = `${direction}${this.column}`;
    this.smTableSortChange.emit(this.smTableSort);
  }

  setClasses() {
    this.el.nativeElement.classList.remove('th-sortable-active', 'th-sortable-desc', 'th-sortable-asc');

    if (this.smTableSort && this.smTableSort.length > 1 && this.smTableSort.slice(1) === this.column) {
      this.el.nativeElement.classList.add('th-sortable-active', (this.smTableSort[0] === '-' ? 'th-sortable-desc' : 'th-sortable-asc'));
    }
  }
}
