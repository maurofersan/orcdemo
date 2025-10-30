import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.css']
})
export class BarcodeComponent implements OnInit {

  @Input() barcode_key  :  any;
  @Input() barcode_value:  any;

  constructor() { }

  ngOnInit(): void {
  }

}
