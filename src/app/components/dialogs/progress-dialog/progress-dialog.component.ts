import { Component, OnInit } from "@angular/core";
import {BsModalRef} from "ngx-bootstrap";
@Component({
  selector: "app-progress-dialog",
  templateUrl: "./progress-dialog.component.html",
  styleUrls: ["./progress-dialog.component.css"]
})
export class ProgressDialogComponent implements OnInit {

  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit() {

  }

}
