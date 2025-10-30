import {Component, Input, OnInit} from '@angular/core';
import {Utils} from "../../../../modules/helpers/Utils";

@Component({
  selector: 'app-face-match',
  templateUrl: './face-match.component.html',
  styleUrls: ['./face-match.component.css']
})
export class FaceMatchComponent implements OnInit {

  @Input() extracted: string;
  constructor() { }

  ngOnInit(): void {}

  showLarge(image_string) {
    Utils.showLarge(image_string);
  }

}
