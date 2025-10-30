import {Component, HostListener, OnInit} from "@angular/core";
import {BsModalService} from "ngx-bootstrap/modal";
import {ContextMenuHelperService} from "./context-menu-helper.service";
import {AppUI, CardOcrSDK, DocumentType, MandatoryFieldValue, Template} from "@identy/identy-ocr";
import {AppUiOption, TemplateOption, UiLocalization} from "../../../modules/models/types";
import {Mobile} from "@identy/identy-common";

@Component({
  selector: "app-title-context-menu",
  templateUrl: "./title-context-menu.component.html",
  styleUrls: ["./title-context-menu.component.css"]
})
export class TitleContextMenuComponent implements OnInit {
  dropdown: any;

  appuis: Array<AppUiOption>;
  selectedAppUi: AppUiOption;
  templates: Array<TemplateOption> = [];
  localizations: Array<UiLocalization>;
  timeouts: Array<number> = [];


  isOpen: boolean;
  fileSelector: boolean;
  useFlash: boolean;
  allowUploads: boolean;
  maxNumAttempts: number;
  integrityCheck: boolean;
  barcodeCheck: boolean;
  showOptions: boolean | any;
  captureTraining: boolean;
  localization: boolean;
  version: string;
  step: number;

  client_version: string
  fields: Array<any>
  @HostListener( "document:click", ["$event"])  docClick(event) {
    if (event.target.classList.contains("dropdown-toggle")) {
      return;
    }

    const closest = this.getClosest(event.target, "ul");
    if (this.isOpen && !closest) {
      document.getElementById("btn-menu").click();
    }
  }

  constructor(public context_menu_helper: ContextMenuHelperService) {

    // this.fileSelector = !Mobile.any();
    // this.fileSelector = false;
    this.useFlash = true;
    this.integrityCheck = false;
    this.barcodeCheck = false;
    this.captureTraining = true;
    this.showOptions = Mobile.any();
    this.maxNumAttempts = 6;
    this.allowUploads = !window['isTest'];
    this.localization = false;
    this.appuis = [
      {
        name: "SELF SERVICE",
        selected: false,
        appui: AppUI.BOXES
      }
    ];

    this.dropdown = {
      uiSelection: false,
      cmpSelection: false,
      tmpSelection: false,
      dspSelection: false
    };

    this.fields = []

    Object.keys(Template).forEach((t) => {
      this.templates.push({
        name: t,
        selected: true,
        template: Template[t]
      })
    })

    this.timeouts.push(10, 20, 30);
    for (let i = 120; i <= 200; i = i + 10) {
      this.timeouts.push(i);
    }

    this.localizations = [
      {
        name: "English",
        selected: true,
        localization: {
          en : {
            FEEDBACK_CAPTURED: 'Captured Successfully',
            FEEDBACK_SEARCHING_BARCODE: 'Position Barcode in the frame',
            FEEDBACK_SEARCHING: 'Use {0} Side',
            FEEDBACK_SEARCHING_2: 'Place your card',
            FEEDBACK_SEARCHING_A4: 'Please place your document',
            FEEDBACK_SEARCHING_A4_2: 'Searching for form, Move away',
            FEEDBACK_SEARCHING_QRCODE: 'Place your Qrcode',
            FEEDBACK_INSIDE_GUIDE: 'Please be inside the guide',
            FEEDBACK_INSIDE_GUIDE_A4: 'Move further away',
            FEEDBACK_PLEASE_HOLD: 'Please hold.',
            FEEDBACK_STABLE: 'Please be stable',
            FEEDBACK_A4_LEFT_ALIGNED: 'Please center document',
            FEEDBACK_A4_RIGHT_ALIGNED: 'Please center document',
            FEEDBACK_CLOSE: 'Please move closer',
            FEEDBACK_FAR: 'Please move further away',
            FEEDBACK_BLURRY: 'Wait for camera to focus',
            FEEDBACK_TILTED: 'Card too rotated',
            FEEDBACK_NOT_STABLE: 'Please be stable',
            FEEDBACK_OK: 'Please Hold',
            FEEDBACK_ATTEMPT_TIMEOUT_EXCEEDED: 'Timeout exceeded.',
            FEEDBACK_NO_DATA: 'Please be stable and avoid shadows or reflections',
            FEEDBACK_BARCODE_NO_DATA: 'Cannot extract Barcodes from image',
            FEEDBACK_NOT_PARALLEL: 'Please be parallel to doc',
            FEEDBACK_CAMERA_ACQUIRING_FAILED: 'Cannot acquire camera, Allow permission Or Retry Capture',
            FEEDBACK_PROCESSING: 'Processing...',
            FEEDBACK_UPLOADING: 'Uploading debug images...',
            FEEDBACK_UPLOAD_FAILURE: 'Internal error retry',
            FEEDBACK_INITIALIZATION: 'Initializing...',
            FEEDBACK_CROPPING: 'Cropping...',
            FEEDBACK_RECOGNITION: 'Running OCR...',
            FEEDBACK_CHANGE_LIGHT: 'Avoid shadows',
            FEEDBACK_BUTTON_CLOSE: 'Close',
            FEEDBACK_BUTTON_RETRY: 'Retry',
            FEEDBACK_TRAINING_BUTTON_NEXT: 'Next',
            FEEDBACK_TRAINING_LABEL: "Don't Show me again",
            FEEDBACK_LICENCE_INVALID: 'License Invalid!!',
            FEEDBACK_ORIENTATION_NOT_SUPPORTED: 'Only Portrait mode is supported',
            FEEDBACK_CHECK_QUALITY_MESSAGE: 'Please check that image is clear, with no blur or glare.',
            FEEDBACK_CAPTURE_BACK_SIDE: 'Select the backside of card',
            ERROR_FILE_FRONT_WRONG_SIDE: 'Invalid front side selected',
            ERROR_FILE_BACK_WRONG_SIDE: 'Invalid back side selected',
            ERROR_FILE_WRONG_POA_TYPE: 'Wrong document type selected',
            ERROR_BROWSER_NOT_SUPPORTED: 'Browser not supported, Please update to Latest Chrome, Firefox (Android) or Safari on IOS.',
            ERROR_WEBRTC_NOT_SUPPORTED: 'Webrtc not supported',
            ERROR_MODEL_FAIL: 'Model detection failed',
            ERROR_SERVER_INTERNAL: 'Internal Server Error',
            ERROR_DEVICE_NOT_SUPPORTED: 'WEBGL Not supported.',
            ERROR_SERVER_CONNECTION_FAILURE: 'Server connection failure',
            FEEDBACK_BACK_WRONG_SIDE: 'Please put the back side',
            FEEDBACK_FRONT_WRONG_SIDE: 'Please put the front side',
            FEEDBACK_WRONG_POA_TYPE: 'Present a valid POA document',
            FACE: {
              'FRONT': 'Front',
              'BACK': 'Back',
              'QRCODE': 'QRCODE'
            },
            BUTTON: {
              'CROP': 'Crop',
              'NEXT': 'Continue',
              'CANCEL': 'Cancel',
              'RETAKE': 'Retake',
            },
          }
        },
      },
      {
        name: "Spanish",
        selected: false,
        localization: {
          "es": {
            "FEEDBACK_CAPTURED": "Captura exitosa",
            "FEEDBACK_SEARCHING_BARCODE": "Posicione el código de barras en el marco",
            "FEEDBACK_SEARCHING": "Utilice el lado {0}",
            "FEEDBACK_SEARCHING_2": "Coloque su tarjeta",
            "FEEDBACK_SEARCHING_A4": "Por favor coloque su documento",
            "FEEDBACK_SEARCHING_A4_2": "Buscando formulario, Aléjese",
            "FEEDBACK_SEARCHING_QRCODE": "Coloque su código QR",
            "FEEDBACK_INSIDE_GUIDE": "Por favor, manténgase dentro de la guía",
            "FEEDBACK_INSIDE_GUIDE_A4": "Aléjese más",
            "FEEDBACK_PLEASE_HOLD": "Por favor, espere.",
            "FEEDBACK_STABLE": "Por favor, manténgase estable",
            "FEEDBACK_A4_LEFT_ALIGNED": "Por favor, centre el documento",
            "FEEDBACK_A4_RIGHT_ALIGNED": "Por favor, centre el documento",
            "FEEDBACK_CLOSE": "Por favor, acérquese",
            "FEEDBACK_FAR": "Por favor, aléjese",
            "FEEDBACK_BLURRY": "Espere a que la cámara enfoque",
            "FEEDBACK_TILTED": "Tarjeta demasiado girada",
            "FEEDBACK_NOT_STABLE": "Por favor, manténgase estable",
            "FEEDBACK_OK": "Por favor, espere",
            "FEEDBACK_ATTEMPT_TIMEOUT_EXCEEDED": "Tiempo de espera excedido.",
            "FEEDBACK_NO_DATA": "Por favor, manténgase estable y evite sombras o reflejos",
            "FEEDBACK_BARCODE_NO_DATA": "No se pueden extraer los códigos de barras de la imagen",
            "FEEDBACK_NOT_PARALLEL": "Por favor, paralelo al documento",
            "FEEDBACK_CAMERA_ACQUIRING_FAILED": "No se puede adquirir la cámara, Permita el permiso o reintente la captura",
            "FEEDBACK_PROCESSING": "Procesando...",
            "FEEDBACK_UPLOADING": "Subiendo imágenes de depuración...",
            "FEEDBACK_UPLOAD_FAILURE": "Error interno, reintente",
            "FEEDBACK_INITIALIZATION": "Inicializando...",
            "FEEDBACK_CROPPING": "Recortando...",
            "FEEDBACK_RECOGNITION": "Ejecutando OCR...",
            "FEEDBACK_CHANGE_LIGHT": "Evite sombras",
            "FEEDBACK_BUTTON_CLOSE": "Cerrar",
            "FEEDBACK_BUTTON_RETRY": "Reintentar",
            "FEEDBACK_TRAINING_BUTTON_NEXT": "Siguiente",
            "FEEDBACK_TRAINING_LABEL": "No mostrar de nuevo",
            "FEEDBACK_LICENCE_INVALID": "¡Licencia inválida!",
            "FEEDBACK_ORIENTATION_NOT_SUPPORTED": "Solo se admite el modo retrato",
            "FEEDBACK_CHECK_QUALITY_MESSAGE": "Por favor, verifique que la imagen esté clara, sin desenfoques o reflejos.",
            "FEEDBACK_CAPTURE_BACK_SIDE": "Seleccione el reverso de la tarjeta",
            "ERROR_FILE_FRONT_WRONG_SIDE": "Lado frontal seleccionado inválido",
            "ERROR_FILE_BACK_WRONG_SIDE": "Lado posterior seleccionado inválido",
            "ERROR_FILE_WRONG_POA_TYPE": "Tipo de documento seleccionado incorrecto",
            "ERROR_BROWSER_NOT_SUPPORTED": "Navegador no compatible, Por favor actualice a la última versión de Chrome, Firefox (Android) o Safari en IOS.",
            "ERROR_WEBRTC_NOT_SUPPORTED": "Webrtc no es compatible",
            "ERROR_MODEL_FAIL": "La detección del modelo falló",
            "ERROR_SERVER_INTERNAL": "Error interno del servidor",
            "ERROR_DEVICE_NOT_SUPPORTED": "WEBGL No es compatible.",
            "ERROR_SERVER_CONNECTION_FAILURE": "Fallo en la conexión con el servidor",
            "FEEDBACK_BACK_WRONG_SIDE": "Por favor, coloque el lado posterior",
            "FEEDBACK_FRONT_WRONG_SIDE": "Por favor, coloque el lado frontal",
            "FEEDBACK_WRONG_POA_TYPE": "Presente un documento de POA válido",
            "FACE": {
              "FRONT": "Frente",
              "BACK": "Reverso",
              "QRCODE": "CÓDIGO QR"
            },
            "BUTTON": {
              "CROP": "Recortar",
              "NEXT": "Continuar",
              "CANCEL": "Cancelar",
              "RETAKE": "Rehacer"
            }
          }
        }
      }
    ];

    this.selectedAppUi = this.appuis[0];
    this.version = CardOcrSDK.version();
    this.update();
  }

  ngOnInit() {
      this.context_menu_helper.localization = this.localizations[0];
      this.context_menu_helper.timeout = 120;
      this.client_version = CardOcrSDK.version();
      this.context_menu_helper.card_change.subscribe((card: DocumentType) => {
        if (card) {
          this.fields.length = 0;
          // @ts-ignore
          const fields: Map<string, Map<MandatoryFieldValue, boolean>> = card.get_fields();
          ["FRONT", "BACK"].forEach((face: string) => {
            if(fields.has(face)) {
              fields.get(face).forEach((v, k) => {
                this.fields.push({
                  face: face,
                  name: k.field,
                  selected: v,
                  field: MandatoryFieldValue[k.name]
                })
              })
            }
          })

        }
      })
  }

  update() {
    setTimeout(() => {

      this.context_menu_helper.showCaptureTraining = this.captureTraining;
      this.context_menu_helper.fileSelection = this.fileSelector;

      setTimeout(() => {
        this.context_menu_helper.templates = this.templates.filter((template) => {
          return template.selected;
        }).map((template) => {
          return template.template;
        });
      }, 10);

      this.context_menu_helper.useFlash = this.useFlash;
      this.context_menu_helper.integrityCheck = this.integrityCheck;
      this.context_menu_helper.barcodeCheck = this.barcodeCheck;
      this.context_menu_helper.maxNumberAttempts = this.maxNumAttempts;
      this.context_menu_helper.mandatoryFields = this.fields;
      this.context_menu_helper.allowUploads = this.allowUploads;

    }, 10);

  }

  doOpen(acc: String) {

    for (const key of Object.keys(this.dropdown)) {
      if (key !== acc ) {
          this.dropdown[key] = false;
      }
    }

  }

  getClosest(elem, selector) {
    const ep: any = Element.prototype;
    if (!ep.matches) {
      ep.matches =
        ep.matchesSelector ||
        ep.mozMatchesSelector ||
        ep.msMatchesSelector ||
        ep.oMatchesSelector ||
        ep.webkitMatchesSelector ||
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1;
        };
    }

    // Get the closest matching element
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
      if ( elem.matches( selector ) ) return elem;
    }
    return null;

  };

  onShown() {
    this.isOpen = true;
  }
  onHide() {
    this.isOpen = false;
  }

  setStep(step: number) {
    this.step = step;
  }


}
