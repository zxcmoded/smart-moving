import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'sm-password-requirements',
  templateUrl: './password-requirements.component.html',
  styleUrls: ['./password-requirements.component.scss']
})
export class PasswordRequirementsComponent implements OnInit {

  @Input() passwordControl: UntypedFormControl;

  constructor() { }

  ngOnInit() {
  }

}
