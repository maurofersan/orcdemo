import {S3Client, PutObjectCommand, PutObjectCommandOutput} from "@aws-sdk/client-s3";
import {Injectable} from "@angular/core";
import {ProgressDialog} from "../../components/sdk-run/progress_dialog_renderer";
import {UtilService} from '@identy/identy-common'
import {ContextMenuHelperService} from "../../components/title-bar/title-context-menu/context-menu-helper.service";

declare const AWSKEY: string;
declare const AWSSECRET: string;
declare const UPLOADS: string;

@Injectable({
  providedIn: "root"
})
export class S3FileUploaderService {
  ak: string = AWSKEY;
  sk: string = AWSSECRET;
  bucket: string = "image-identy-web";
  uploading: boolean = false;
  client: S3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: this.ak,
      secretAccessKey: this.sk,
    },
  });
  uploadItemQueue: Array<UploadObject> = [];

  constructor(private contextMenuSelection: ContextMenuHelperService) {}

  async upload(bucket: string, filePath: string, data: ArrayBuffer, contentType: string, contentEncoding: string = 'base64') {
    const params: any = {
      Bucket: bucket,
      Key: filePath,
      Body: data,
      ContentEncoding: contentEncoding,
      ContentType: contentType
    };
    return this.client.send(new PutObjectCommand(params));
  }

  async uploadImage(bucket: string, file: string, data: ArrayBuffer) {
    return this.upload(bucket, file, data, 'image/jpeg');
  }

  async uploadFrame(file: string, data: ArrayBuffer) {
    return this.upload(file, "web-ui-images", data, 'image/jpeg')
  }

  addUploadObject(frame: UploadObject) {
    if (!this.contextMenuSelection.allowUploads) {
      return;
    }
    this.uploadItemQueue.push(frame);
  }

  async upload_frames() {
    if (!UPLOADS) {
      this.uploadItemQueue.length = 0
    }
    if(this.uploading)  {
      return;
    }
    this.uploading = true;
    const pd = new ProgressDialog("Uploading...", true);
    const uuid = uuidv4();
    const promises: Promise<PutObjectCommandOutput>[] = [];
    for (let i = 0; i < this.uploadItemQueue.length; i++) {
      const ui = this.uploadItemQueue[i];
      const group = `${this.format(new Date(), 'dd-MM-yyyy')}/${!sessionStorage.getItem("lu") ? "default" : sessionStorage.getItem("lu")}/${ui.modality}/${uuid}`;
      let buffer: Uint8Array;
      if (ui.type === "IMAGE") {
        buffer = Uint8Array.from(atob(ui.data), c => c.charCodeAt(0));
      } else if (ui.type === "TEXT") {
        buffer = new TextEncoder().encode(ui.data);
      }

      console.log(`Frame: ${group}/${ui.file}`);
      promises.push(this.upload(ui.bucket, `${group}/${ui.file}`, buffer, ui.type == "IMAGE" ? 'image/jpeg' : "text/plain"));
    }
    return Promise.all(promises).then(() => {
      this.uploadItemQueue.length = 0;
      this.uploading = false;
      pd.hide();
    })
  }

  format = function date2str(x, y) {
    var z = {
      M: x.getMonth() + 1,
      d: x.getDate(),
      h: x.getHours(),
      m: x.getMinutes(),
      s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
      return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2)
    });

    return y.replace(/(y+)/g, function (v) {
      return x.getFullYear().toString().slice(-v.length)
    });
  }

  ImageDataToBase64Url(imagedata: ImageData, isFull: boolean = false) {
    const destCanvas: any = document.createElement("canvas");

    destCanvas.width = imagedata.width;
    destCanvas.height = imagedata.height;
    const quality = isFull ? 1.0 : 0.95;

    destCanvas.getContext('2d').putImageData(imagedata, 0, 0);      // newCanvas, same size as source rect
    const url = destCanvas.toDataURL('image/jpeg', quality);

    destCanvas.getContext('2d').clearRect(0, 0, destCanvas.width, destCanvas.height);
    destCanvas.remove();
    return url;
  }


}

export interface UploadObject {
  file: string,
  type: string,
  modality: string;
  ts: number;
  bucket: string;
  face: string;
  data: string;
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    // tslint:disable-next-line:one-variable-per-declaration no-bitwise
    const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
