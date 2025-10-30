import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {CardDetectionMode, DocumentType} from "@identy/identy-ocr";
import {ContextMenuHelperService} from "../title-bar/title-context-menu/context-menu-helper.service";
import {CardSelectionHelperService} from "./card-selection-helper.service";

@Component({
  selector: "app-card-face-selection",
  templateUrl: "./card-face-selection.component.html",
  styleUrls: ["./card-face-selection.component.css"]
})
export class CardFaceSelectionComponent implements OnInit, OnChanges {

  @Input() public card_type: DocumentType;
  public card_faces = [
    {
      label: 'Card Front',
      selected: true,
      disabled: false,
      face: CardDetectionMode.FRONT
    },
    {
      label: 'Card Back',
      selected: true,
      disabled: false,
      face: CardDetectionMode.BACK

    }
  ]

  constructor(private contextMenuHelper: ContextMenuHelperService) {}

  ngOnChanges(changes: SimpleChanges): void {}

  // ngOnInit() {
  //   this.contextMenuHelper.card_change.subscribe(card => {
  //     if (card) {
  //       this.card_faces.filter((c) => {
  //         return c.face === CardDetectionMode.BACK
  //       }).forEach((c) => {
  //         c.selected = !card.isA4 &&  !["PASSPORT","IND_PAN_CARD", "MEXICO_PASSPORT", "TANZANIA_VOTER_ID", "TANZANIA_DL", "TANZANIA_NIDA", "PHILIPPINES_ID", "KSA_ALIEN_ID"].some(function (v) {
  //           return card.name === v;
  //         });
  //         c.disabled = !c.selected
  //       })
  //     }
  //     this.updateSelection();
  //   })
  //   this.updateSelection();
  // }
  ngOnInit() {
    this.contextMenuHelper.card_change.subscribe(card => {
      if (card) {
        // Handle BACK side deselection for specific cards
        this.card_faces.filter(c => c.face === CardDetectionMode.BACK)
          .forEach(c => {
            c.selected = !card.isA4 && ![
              "PASSPORT", "IND_PAN_CARD", "MEXICO_PASSPORT", 
              "TANZANIA_VOTER_ID", "TANZANIA_DL", "TANZANIA_NIDA", "MALAYSIA_PASSPORT" ,
              "PHILIPPINES_ID", "KSA_ALIEN_ID","SOUTH_AFRICA_ID","PHILIPPINES_ID","AIRTEL_SIM_WRAPPER"
            ].includes(card.name);
            c.disabled = !c.selected;
          });
  
        // Handle FRONT side deselection for MEXICO_BCC
        this.card_faces.filter(c => c.face === CardDetectionMode.FRONT)
          .forEach(c => {
            c.selected = card.name !== "MEXICO_BCC";
            c.disabled = !c.selected;
          });
      }
      this.updateSelection();
    });
  
    this.updateSelection();
  }
  

  public updateSelection() {
    setTimeout(() => {
      this.contextMenuHelper.cards = this.card_faces.filter((card) => {
        return card.selected;
      }).map((card) => {
          return card.face
        }
      );
    }, 100);

  }

}
