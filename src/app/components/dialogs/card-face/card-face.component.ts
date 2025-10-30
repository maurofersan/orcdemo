import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {CardSelectionHelperService} from "../../card-selection/card-selection-helper.service";
import {CardDetectionMode} from "@identy/identy-ocr";
import {ContextMenuHelperService} from "../../title-bar/title-context-menu/context-menu-helper.service";

@Component({
  selector: 'app-card-face',
  templateUrl: './card-face.component.html',
  styleUrls: ['./card-face.component.css']
})
export class CardFaceComponent implements OnInit {
  public message: SafeHtml;
  @Input() private card_face: string;
  constructor(private sanitizer: DomSanitizer, private context: ContextMenuHelperService, private contextMenu: ContextMenuHelperService) { }

  ngOnInit(): void {
    let message = "";
    switch (this.card_face) {
      case "FRONT": {
         message = "Front side captured correctly! " + (this.context.cards.includes(CardDetectionMode.BACK) ? "<br/> Now please capture the back": "")
         if (this.contextMenu.card_type.isA4) {
           message = "Document captured correctly";
         }
      };
      break
      case "BACK":  {
        message = "Back side captured correctly!"
        if (this.contextMenu.card_type.isA4) {
          message = "Document back captured correctly";
        }
      }
      break;
    }
    this.message = this.sanitizer.bypassSecurityTrustHtml(message);
  }

}
