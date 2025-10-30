import { Component, Input, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap";
import { DomSanitizer, SafeHtml, SafeUrl } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";
import { Localization } from "@identy/identy-ocr";
import { TxnResult } from "../../../modules/models/TxnResult";

@Component({
  selector: "app-transaction-dialog",
  templateUrl: "./transaction-dialog.component.html",
  styleUrls: ["./transaction-dialog.component.css"],
})

export class TransactionDialogComponent implements OnInit {
  @Input() public response: any;
  @Input() public timedout: boolean;
  @Input() private onclose: Function;
  @Input() private onretry: Function;
  @Input() private localization: Localization;
  private height: number;
  public retry: boolean = false;
  constructor(private bsModalRef: BsModalRef, private sanitizer: DomSanitizer,private http: HttpClient) {
    this.height = 0;
    this.http = http;
  }


  public txnInput: TxnResult = {};
  public extracted_face: SafeUrl;
  public card_type: any;

  public closeButtonlabel = "Close";
  public description: SafeHtml;

  public ocr_output: any;

  public txn_icon: string = "";
  public txn_icon_color: string = "";
  private error: boolean = true;
  private incorrect_extraction: boolean = false;
  ngOnInit() {
    setTimeout(() => {
      if (!this.response) {
        this.response = {};
        return;
      }

      if (
        this.response &&
        (this.response.code === 600 || this.response.code === 506)
      ) {
        const m = this.localization.getString("FEEDBACK_LICENCE_INVALID");
        this.description = m;
        return;
      }

      this.ocr_output = this.response?.ocr_output;
      if (this.ocr_output) {
        const ocr = this.ocr_output;
        if (ocr["front"]) {
          this.txnInput.card_front_valid = ocr.front["hasQuality"];
          this.incorrect_extraction = ocr.front["low_confidence"] != void 0;
          this.txnInput.card_front =
            "data:image/jpg;base64," + ocr.front.templates["JPEG"];
          if (ocr?.front?.biometrics?.FACE?.image) {
            this.extracted_face =
              "data:image/jpg;base64," + ocr.front.biometrics.FACE.image;
          }
          if (ocr.front.templates["JPEG_BACK"]) {
            this.txnInput.card_back =
              "data:image/jpg;base64," + ocr.front.templates["JPEG_BACK"];
          }

          this.card_type = ocr.front.type;
          if (ocr.front.data) {
            this.txnInput.card_front_fields = ocr.front.data;
          }
          if (
            ocr.front.barcodes &&
            Object.keys(ocr.front.barcodes).length > 0
          ) {
            this.txnInput.card_front_barcodes = ocr.front.barcodes;
          }
        } else {
          if (ocr["hasQuality"]) {
            this.txnInput.card_front_valid = ocr["hasQuality"];
          }
          if (ocr["low_confidence"]) {
            this.incorrect_extraction = ocr["low_confidence"] != void 0;
          }
          if (ocr.templates && ocr.templates["JPEG"]) {
            this.txnInput.card_front = "data:image/jpg;base64," + ocr.templates["JPEG"];
          }
          if (ocr.data) {
            this.txnInput.card_front_fields = ocr.data;
          }
          if (ocr.data && ocr.data.QR && Object.keys(ocr.data.QR).length > 0) {
            this.txnInput.card_front_barcodes = ocr.data.QR;
          }
          if (ocr["poaType"]) {
            this.txnInput.poa_type = ocr["poaType"];
          }
          if (ocr["integrityCheckError"]) {
            this.txnInput.integrity_check_error = ocr["integrityCheckError"];
          }
          if (ocr["error"]) {
            this.txnInput.error_str = ocr["error"];
          }
        }

        if (ocr.back) {
          this.txnInput.card_back_valid = ocr.back["hasQuality"];
          this.incorrect_extraction = ocr.front["low_confidence"] != void 0;

          this.txnInput.card_back =
            "data:image/jpg;base64," + ocr.back.templates["JPEG"];
          if (ocr?.back?.biometrics?.FACE?.image) {
            this.extracted_face =
              "data:image/jpg;base64," + ocr.back.biometrics.FACE.image;
          }

          if (ocr.back.data) {
            this.txnInput.card_back_fields = ocr.back.data;
          }
          if (ocr.back.barcodes && Object.keys(ocr.back.barcodes).length > 0) {
            this.txnInput.card_back_barcodes = ocr.back.barcodes;
          }
        }
        if (ocr["dataValidation"]) {
          this.txnInput.card_data_validation = ocr["dataValidation"];
        }
      }

      let message: SafeHtml = "Internal Server Error";
      if (this.ocr_output) {
        message = "Captured Successfully..";
        this.error = false;
      }
      if (this.timedout) {
        message = "Timed out..";
        this.error = false;
      }

      this.txn_icon = this.error ? "fa-times-circle" : "fa-check-circle";
      this.txn_icon_color = this.error ? "#ff0000" : "#01751e";
      this.description = message;
      if (this.incorrect_extraction) {
        this.description = "Low Confidence";
      }
    }, 40);
  }

  onDebugClicked() {
    var myjson = JSON.stringify(this.ocr_output, null, 2);
    var x = window.open();
    x.document.open();
    x.document.write("<html><body><pre>" + myjson + "</pre></body></html>");
    x.document.close();
  }

  onCloseClicked() {
    // var myjson = JSON.stringify(this.ocr_output, null, 2);
    console.log(typeof this.ocr_output,"close is clicked");
    const allowPost = (window as any).allow_post;
  
    // console.log(this.ocr_output);
    // this.http.post("http://localhost:3001/createfile", this.ocr_output).subscribe();
    if (allowPost === 'true') {
        console.log("allow post value",allowPost);
        this.http.post("http://localhost:3001/createfile", this.ocr_output)
      .subscribe();
  }
    // try {
    //   const data = JSON.stringify(this.ocr_output);
    //   const oUrl = URL.createObjectURL(new Blob([data], {type: "text/plain"}));
    //   console.log(oUrl);
    //   window['ocr_response'] = oUrl;
    // } catch (error) {
    //   console.log("error creating element");
    // }

    this.bsModalRef.hide();
    if (this.onclose) {
      this.onclose();
    }
  }

  onRetryClicked() {
    this.bsModalRef.hide();
    if (this.onretry) {
      this.onretry();
    }
  }

  public showLarge(imageS: any) {
    const image = new Image();
    image.src = imageS;
    const w = window.open("");
    w.document.write(image.outerHTML);
  }
}
