import {Component, Input, OnInit} from '@angular/core';
import {Utils} from "../../../../modules/helpers/Utils";
import {TxnResult} from "../../../../modules/models/TxnResult";

@Component({
  selector: 'app-ocr-result',
  templateUrl: './ocr-result.component.html',
  styleUrls: ['./ocr-result.component.css']
})
export class OcrResultComponent implements OnInit {
  @Input() txnInput: TxnResult;

  constructor() { }

  ngOnInit(): void {
    console.log(this.txnInput);
  }

  showLarge(image_string) {
    Utils.showLarge(image_string);
  }

  protected readonly Array = Array;
  protected readonly String = String;
}
