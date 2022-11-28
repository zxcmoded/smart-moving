import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ContactViewModel } from 'app/generated/Opportunities/Common/contact-view-model';

@Component({
  selector: 'sm-secondary-contact',
  templateUrl: './secondary-contact.component.html',
  styleUrls: ['./secondary-contact.component.scss']
})
export class SecondaryContactComponent implements OnInit {

  @Input() contact: ContactViewModel;

  @Output() editRequested = new EventEmitter();
  @Output() deleteRequested = new EventEmitter();

  constructor(
  ) { }

  ngOnInit() {
  }
}
