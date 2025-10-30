import { Injectable } from "@angular/core";
import {CardDetectionMode} from "@identy/identy-ocr";
import {Subject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CardSelectionHelperService {
  public cards: Array<CardDetectionMode>;
  public cardSelection: Subject<CardDetectionMode[]>;

  constructor() {
    this.cardSelection = new Subject();
    this.cardSelection.subscribe((cards: CardDetectionMode[]) => {
      this.cards = cards;
    });

  }
}
