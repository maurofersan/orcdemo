import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {

  @Input() validation_key  :  any;
  @Input() validation_value:  any;

  constructor() { }

  ngOnInit(): void {
  }

}
