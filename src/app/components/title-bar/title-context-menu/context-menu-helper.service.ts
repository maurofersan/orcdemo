import { Injectable } from "@angular/core";
import {AppUI, Template, DocumentType, CardDetectionMode} from '@identy/identy-ocr';
import {UiLocalization} from "../../../modules/models/types";
import {Subject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ContextMenuHelperService {

  public showCaptureTraining: boolean;
  public fileSelection: boolean;
  public templates: Template[];
  public useFlash: boolean;
  public integrityCheck: boolean;
  public barcodeCheck: boolean;
  public card_type: DocumentType=DocumentType.INE_CARD;
  public maxNumberAttempts: number;
  public mandatoryFields: Array<any>;
  public allowUploads: boolean;
  public localization: UiLocalization;
  public timeout: number;
  public cards: Array<CardDetectionMode>;
  public card_change: Subject<DocumentType> = new Subject<DocumentType>();
  public skipSupportCheck: boolean = false;

  constructor() {}

}
