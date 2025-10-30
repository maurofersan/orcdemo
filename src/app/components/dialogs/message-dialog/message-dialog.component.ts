import {Component, Input, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {

  constructor(private bsModalRef: BsModalRef) { }
  @Input() public message: any;
  ngOnInit(): void {}

  closeClicked() {
    this.bsModalRef.hide();
  }
}
