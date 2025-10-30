import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ContextMenuHelperService} from "../title-bar/title-context-menu/context-menu-helper.service";
import {DocumentType, DocumentType as OcrDocType} from "@identy/identy-ocr";
import {hasOwnProperty} from "tslint/lib/utils";

type CardType = {
  name: string,
  document: OcrDocType,
  visible?: boolean;
}
@Component({
  selector: 'app-id-type',
  templateUrl: './id-type.component.html',
  styleUrls: ['./id-type.component.css']
})
export class IdTypeComponent implements OnInit {
  id_types: Array<CardType> =[];
  selected_types: Array<CardType> = [];

  selected: CardType = {
    document: OcrDocType.INE_CARD,
    name: OcrDocType.INE_CARD.name,
    visible: true
  };

  constructor(public context_menu_helper: ContextMenuHelperService) {}

  ngOnInit(): void {
    const ignore = ['name', 'full_name', 'country', 'visible'];
    for (const documentTypeElement of Object.keys(OcrDocType)) {
      if(hasOwnProperty(OcrDocType, documentTypeElement)) {
        if (!ignore.includes(documentTypeElement)) {
          this.id_types.push({
            document: OcrDocType[documentTypeElement],
            name: OcrDocType[documentTypeElement].name,
            visible: OcrDocType[documentTypeElement].visible
          })
        }
      }
    }
    this.selected_types = this.id_types;
    this.context_menu_helper.card_type = this.selected.document;
    this.context_menu_helper.card_change.next(this.context_menu_helper.card_type);
  }

  change() {
    this.context_menu_helper.card_change.next(this.context_menu_helper.card_type);
  }

  select(type: CardType) {
    this.selected = type;
    this.context_menu_helper.card_type=type.document;
  }

  onKey(event) {
    this.selected_types = this.search(event.target.value);
    event.stopPropagation();

  }

  search(value: string) {
    let filter = value.toLowerCase();
    const ids = this.id_types.filter((option) =>{
      return  option.name.toLowerCase().includes(filter);
    });
    return ids;
  }

  onClick(event) {
    event.stopPropagation();
  }
}
