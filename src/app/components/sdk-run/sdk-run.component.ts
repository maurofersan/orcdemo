import { Component, OnInit } from "@angular/core";
import {
  Base64,
  CardDetectionMode,
  CardOcrSDK,
  DocumentType,
  MandatoryFieldValue,
  SdkOptionsType,
  Template,
  TransactionMode,
} from "@identy/identy-ocr";
import { ContextMenuHelperService } from "../title-bar/title-context-menu/context-menu-helper.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { TransactionDialogComponent } from "../dialogs/transaction-dialog/transaction-dialog.component";
import { CardSelectionHelperService } from "../card-selection/card-selection-helper.service";
import { UserInputComponent } from "../dialogs/user-input/user-input.component";
import { S3FileUploaderService } from "../../modules/helpers/s3FileUploader";
import { CardFaceComponent } from "../dialogs/card-face/card-face.component";
import $ from "jquery";
import * as template from "../../../assets/html/template";
import { environment } from "../../../environments/environment";
declare var WURFL: any;
//@ts-ignore
import * as cam_logo from "../../../assets/images/camera.png";
//@ts-ignore
import * as gall_logo from "../../../assets/images/gallery.png";
@Component({
  selector: "app-sdk-run",
  templateUrl: "./sdk-run.component.html",
  styleUrls: ["./sdk-run.component.css"],
})
export class SdkRunComponent implements OnInit {
  isLocalhost: boolean = window.location.origin.includes("localhost");
  enableLogrocket = !window["isTest"] && !this.isLocalhost;
  username = this.isLocalhost ? "localhost" : null;

  public readonly cam_image = cam_logo["default"];
  public readonly gal_image = gall_logo["default"];
  constructor(
    private contextMenuSelection: ContextMenuHelperService,
    private modalService: BsModalService,
    private cardFaceSelection: CardSelectionHelperService,
    private s3Upload: S3FileUploaderService
  ) {}

  bsModelTxnDialog: BsModalRef;
  silo: string = "";
  sdk: CardOcrSDK;
  disabled: boolean = false;
  has_timedout: boolean;
  ngOnInit() {
    try {
      this.getUser().then((username) => {
        this.username = username;
        const userId =
          (username || "default") + ":" + WURFL.complete_device_name;
        if (this.enableLogrocket && window["LogRocket"]) {
          console.log("Recording Web.......");
          window["LogRocket"].init("tgsvwu/ocr_debug");
          window["LogRocket"].identify({
            userID: userId,
          });
          window["LogRocket"].startNewSession();
          window["LogRocket"].getSessionURL((sessionURL) => {
            console.log(sessionURL);
          });
        }
      });
    } catch (e) {
      console.log(e);
    }

    $(window).on("beforeunload", (e) => {
      if (this.sdk) {
        this.sdk.abort().then(() => {
          if (this.s3Upload.uploadItemQueue.length > 0) {
            this.s3Upload.upload_frames().then(() => {
              alert("You can exit the page now..");
            });
          }
        });
        e.preventDefault();
      }
    });
  }

  getUser() {
    return new Promise<string>((resolve) => {
      if (this.username || sessionStorage.getItem("lu")) {
        this.username = sessionStorage.getItem("lu");
        return resolve(this.username);
      }
      console.log("User rendering");
      this.modalService.show(UserInputComponent, {
        initialState: {
          onclose: (username: string) => {
            console.log(`Username: ${username}`);
            sessionStorage.setItem("lu", username);
            resolve(username);
          },
        },
        backdrop: true,
        ignoreBackdropClick: true,
      });
    });
  }


  runCaptureOCR(transaction: TransactionMode) {
    return new Promise((resolve, reject) => {
      this.has_timedout = false;
      this.disabled = !this.contextMenuSelection.fileSelection;
      let uuid = 1;
      let group = this.makeid(5);
      const card_type = this.contextMenuSelection.card_type;
      const options: SdkOptionsType = {
        allowClose: true,
        detectionModes: this.contextMenuSelection.cards,
        a4IntegrityCheck: this.contextMenuSelection.integrityCheck,
        cardtype: this.contextMenuSelection.card_type,
        barcodeCheck: this.contextMenuSelection.barcodeCheck,
        maxNumberAttempts: this.contextMenuSelection.maxNumberAttempts,
        requiredTemplates: this.contextMenuSelection.templates,
        localization: this.contextMenuSelection.localization.localization,
        showCaptureTraining: this.contextMenuSelection.showCaptureTraining,
        allowUnknownBrowsers: [{ name: "Instagram", version: 250},{name :"TikTok",version : 21}],
        exitTimout: this.contextMenuSelection.timeout * 1000,
        skipSupportCheck: this.contextMenuSelection.skipSupportCheck,
        // graphics: {
        //   training: {
        //     DIALOG_CONTENT: template as any
        //   }
        // },
        // graphics: {
        //   training: {
        //     show: true,
        //     DIALOG_CONTENT: "Hi there i am training",
        //   },
        //   silhouette: {
        //     CARD_FRONT: "#2cee91",
        //     CARD_BACK: "#2cee99",
        //     A4_FRONT: "#000000",
        //     A4_BACK: "#ffffff",
        //     enable: true,
        //     animate_flip: true,
        //   },
        //   canvas:{
        //     label:"We are capturing your document",
        //     labelBackground:"#2cee91",
        //     guideBorderColor:"#fff000",
        //   }
        // },
        transaction: {
          type: transaction,
        },
        useFlash: this.contextMenuSelection.useFlash,
        events: {
          // onFileSelectionPNGConversion:(images:string[]) => {
          //   console.log("Adding the selected PDF file into s3");
          //   for (const image of images) {
          //     this.s3Upload.addUploadObject({
          //       file: `frame_PDF_IMAGE_${group}_${uuid}_${new Date().getTime()}.png`,
          //       type: "IMAGE",
          //       face: "FRONT",
          //       data: image,
          //       bucket: "image-identy-web",
          //       modality: "OCR",
          //       ts: new Date().getTime()
          //     });
          //   }
          // },
          onCardFaceCaptureSuccess:(face: string) => {
            return new Promise((resolve, reject) => {
              const dialog = this.modalService.show(CardFaceComponent, {
                class: "modal-dialog-centered modal-sm txn-modal-dialog modal-card-face",
                backdrop:true,
                ignoreBackdropClick: true,
                initialState: {
                  card_face: face
                }
              });
              setTimeout(() => {
                $(".modal-card-face").parent("modal-container").css("z-index", 99999999);
                $(".modal-card-face").find(".modal-content").css("min-width", 390);
                if(window.orientation === 0 && !this.contextMenuSelection.card_type.isA4) {
                  $(".modal-card-face").find(".modal-content").css("transform", "rotate(90deg)");
                }
                setTimeout(() => { dialog.hide() ;resolve(null)}, 3000)
              }, 10);

            });
          },
          onWrongDocumentShown: () => {
            alert("Present a valid POA document");
          },
          onBatteryLow: () => {
            alert(
              "Battery low, Capture quality may suffer without flash. Please charge your phone."
            );
          },
          onNoDataDetected: () => {
            alert("No data detected, retry again. EXITING");
          },
          onCaptureStarted: (face) => {
            // if(face === "BACK" && !this.contextMenuSelection.selection.fileSelection) {
            //   alert("Capture back of the document.");
            // }
          },
          onCaptured: (image: string, face: string) => {
            this.s3Upload.addUploadObject({
              file: `frame_${group}_${uuid}_${new Date().getTime()}.jpg`,
              type: "IMAGE",
              face: face,
              data: image,
              bucket: "image-identy-web",
              modality: "OCR",
              ts: new Date().getTime(),
            });
          },
          onRecognition: (image: string, face: string, data?: any) => {
            const ts = new Date().getTime();
            this.s3Upload.addUploadObject({
              file: `frame_recog_${group}_${uuid}_${ts}.jpg`,
              type: "IMAGE",
              face: face,
              data: image,
              bucket: "image-identy-web",
              modality: "OCR",
              ts: new Date().getTime(),
            });
            if (data) {
              this.s3Upload.addUploadObject({
                file: `frame_recog_data_${
                  options.cardtype.isA4 ? "a4" : "card"
                }_${group}_${uuid}_${ts}.txt`,
                type: "TEXT",
                face: "FRONT",
                data: JSON.stringify(data),
                bucket: "image-identy-web",
                modality: "OCR",
                ts: new Date().getTime(),
              });
            }
          },
          onA4CropComplete: (
            full: string,
            cropped: string,
            bounds: any,
            actual_bounds
          ) => {
            this.s3Upload.addUploadObject({
              file: `frame_A4_FULL_${group}_${uuid}_${new Date().getTime()}.jpg`,
              type: "IMAGE",
              face: "FRONT",
              data: full,
              bucket: "image-identy-web",
              modality: "OCR",
              ts: new Date().getTime(),
            });
            this.s3Upload.addUploadObject({
              file: `frame_A4_CROPPED_${group}_${uuid}_${new Date().getTime()}.jpg`,
              type: "IMAGE",
              face: "FRONT",
              data: cropped,
              bucket: "image-identy-web",
              modality: "OCR",
              ts: new Date().getTime(),
            });
            this.s3Upload.addUploadObject({
              file: `frame_A4_BOUNDS_corrected_${group}_${uuid}_${new Date().getTime()}.txt`,
              type: "TEXT",
              face: "FRONT",
              data: JSON.stringify(bounds),
              bucket: "image-identy-web",
              modality: "OCR",
              ts: new Date().getTime(),
            });
            this.s3Upload.addUploadObject({
              file: `frame_A4_ACTUAL_BOUNDS_corrected_${group}_${uuid}_${new Date().getTime()}.txt`,
              type: "TEXT",
              face: "FRONT",
              data: JSON.stringify(actual_bounds),
              bucket: "image-identy-web",
              modality: "OCR",
              ts: new Date().getTime(),
            });
          },
          onAttempt: (attempt) => {
            uuid = attempt;
          },
          onCrash: (image) => {
            console.log("Adding crash");
            this.s3Upload.addUploadObject({
              file: `frame_A4_CRASHED_${group}_${uuid}_${new Date().getTime()}.jpg`,
              type: "IMAGE",
              face: "FRONT",
              data: image,
              bucket: "image-identy-web",
              modality: "OCR",
              ts: new Date().getTime(),
            });
          },
          onVerifyFrame: (image) => {
            console.log("Adding verify");
            this.s3Upload.addUploadObject({
              file: `frame_A4_VERIFY_${group}_${uuid}_${new Date().getTime()}.jpg`,
              type: "IMAGE",
              face: "FRONT",
              data: image,
              bucket: "image-identy-web",
              modality: "OCR",
              ts: new Date().getTime(),
            });
          },
          onBarcodeProcess: (image, card_face, type) => {
            console.log("Adding BAR/QR Code");
            this.s3Upload.addUploadObject({
              file: `frame_${type}_${card_face}_${group}_${uuid}_${new Date().getTime()}.jpg`,
              type: "IMAGE",
              face: card_face,
              data: image,
              bucket: "image-identy-web",
              modality: "OCR",
              ts: new Date().getTime(),
            });
          },
        },
        debug: true,
        selectAsFile: this.contextMenuSelection.fileSelection,
      };
      if (
        card_type === DocumentType.A4_POA_TELMEX ||
        card_type === DocumentType.A4_POA_CFE ||
        card_type === DocumentType.INE_CARD
      ) {
        const mapfields = new Map<string, Map<MandatoryFieldValue, boolean>>();
        console.log(this.contextMenuSelection.mandatoryFields, "mandatory fields");
        for (const mandatoryField of this.contextMenuSelection
          .mandatoryFields) {
          if (!mapfields.has(mandatoryField.face)) {
            mapfields.set(
              mandatoryField.face,
              new Map<MandatoryFieldValue, boolean>()
            );
          }
          mapfields
            .get(mandatoryField.face)
            .set(mandatoryField.field, mandatoryField.selected);
        }
        console.log(mapfields,"mapfields");
        options.mandatoryFields = mapfields;
      }
      const cardOcrSDK = new CardOcrSDK(options);
      this.sdk = cardOcrSDK;
      cardOcrSDK.onInit = () => {
        // @ts-ignore
        cardOcrSDK
          .capture()
          .then(async (blob: any) => {
            console.log("hi below is the data");
            this.disabled = false;
            return resolve(this.postData(blob));
          })
          .catch((err) => {
            this.disabled = false;
            if (
              err["type"] &&
              err["type"] === "LocalizationErrorData" &&
              err.data != void 0
            ) {
              this.has_timedout = true;
              return resolve(this.postData(err.data));
            }
            this.s3Upload.upload_frames().then(() => {
              console.log("Frames uploaded....");
            });
            if (
              err &&
              err["code"] &&
              (err["code"] === 105 ||
                err["code"] === 520 ||
                err["code"] === 522 ||
                err["code"] === 523)
            ) {
              if (err["message"] === "ERROR_IMAGE_SIZE_SMALL") {
                alert("Image size too small");
              } else if (err["message"] === "FEEDBACK_CAPTURE_NOT_SUPPORTED") {
                alert("Current card capture is not supported");
              } else {
                alert(err["message"]);
              }
            }
            if (err && err["code"] && err["code"] === 811) {
              alert("Native crash");
            }
            return reject(err);
          });
      };

      cardOcrSDK.initialize().catch((err) => {
        this.disabled = false;
        const m = err && err["getLocalizedString"];
        if (m) {
          if (err.code === 100 || err.code === 104 || err.code === 500) {
            alert(err.getLocalizedString());
            reject(err);
          }

          if (err.code === 600 || err.code == 506) {
            const clientResponse = {
              code: err.code,
              feedback_code: err.message,
              spoof: null,
            };
            this.bsModelTxnDialog = this.modalService.show(
              TransactionDialogComponent,
              {
                class: "modal-dialog-centered modal-md txn-modal-dialog",
                initialState: {
                  response: clientResponse,
                  options: options,
                  localization: cardOcrSDK.localization,
                  onclose: () => {
                    this.bsModelTxnDialog.hide();
                    reject(err);
                  },
                  onretry: () => {
                    this.capture();
                  },
                },
              }
            );
          }
        } else {
          reject(err);
        }
      });
    });
  }
  makeid = function (length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  format = function date2str(x, y) {
    var z = {
      M: x.getMonth() + 1,
      d: x.getDate(),
      h: x.getHours(),
      m: x.getMinutes(),
      s: x.getSeconds(),
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
      return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2);
    });

    return y.replace(/(y+)/g, function (v) {
      return x.getFullYear().toString().slice(-v.length);
    });
  };

  postData(capresult: any) {
    return new Promise((resolve, reject) => {
      return resolve(capresult);
    });
  }

  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        // tslint:disable-next-line:one-variable-per-declaration no-bitwise
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  //
  capture() {
    return new Promise((resolve, reject) => {
      this.runCaptureOCR(TransactionMode.CAPTURE)
        .then((response: any) => {
          let func = "postData";
          if (typeof response !== "object") {
            func = "postData1";
          }
          return this[func](response).then((dec) => {
            if (dec) {
              return resolve({
                ocr_output: dec,
              });
            }
          });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  postData1(response: any) {
    /// Response needs to be converted to blob
    /// This part is important
    const blob = new Blob([response], {
      type: "plain/text",
      endings: "native",
    });
    const fd = new FormData();
    fd.append("file", blob, `bdata`);

    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: `${environment.url}/api/v1/process`,
        contentType: false,
        processData: false,
        method: "POST",
        dataType: "JSON",
        data: fd,
        headers: {
          "X-DEBUG": this.username,
          LogAPITrigger: true,
          requestID: "requestID123123123",
        },
      })
        .done((response) => {
          resolve(response);
        })
        .fail(reject);
    });
  }

  triggerGallery(){
    this.contextMenuSelection.fileSelection = true;
    this.triggerCapture();
  }

  triggerCamera(){
    this.contextMenuSelection.fileSelection = false;
    this.triggerCapture();
  }

  triggerCapture() {
    return new Promise((resolve, reject) => {
      this.capture()
        .then((final: any) => {
          this.bsModelTxnDialog = this.modalService.show(
            TransactionDialogComponent,
            {
              class: "modal-dialog-centered modal-md txn-modal-dialog",
              initialState: {
                response: final,
                timedout: this.has_timedout,
                onclose: () => {
                  this.bsModelTxnDialog.hide();
                  return this.s3Upload.upload_frames().then(() => {
                    return resolve(null);
                  });
                },
              },
            }
          );
        })
        .catch((err) => {
          console.log(err);
          if (err["code"] && (err["code"] == 800 || err["code"] == 801)) {
            alert(err.getLocalizedString());
          }
        });
    });
  }
}
