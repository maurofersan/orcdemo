import {Component, Input, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})
export class UserInputComponent implements OnInit {

  @Input() onclose: Function;
  public user_name: string = "";
  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  close() {
    if (this.user_name === "") {
       alert("A name is required");
       return;
    }
    if (this.onclose) {
      this.onclose(this.user_name);
    }
    this.bsModalRef.hide();
  }

}
