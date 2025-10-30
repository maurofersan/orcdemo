import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
// @ts-ignore
import { CardOcrSDK } from "@identy/identy-ocr";
const LICENSE =
  "QUVTAgAAAGzINdTc96gA4Y9ZPxP2IBV6Oe8oxFBtsMkubyhcOMw8W1Dckd3AG24OfabMFlKTmk6cVA2Ii5lZPMdM7dvpbGDYP2YdrYX205pwodJX+gOWgb73Fu6A1v1433jbzy7s8eqBbPqFEBb4H+M1HSQtle0EajqHC67MZ53S5WhqLmWTxMKVYgdizqw6TCxUtoeJSmI=";

if (environment.production) {
  enableProdMode();
}
// ******************************* //
// Preinitialize... //
// ******************************* //
// SDK needs to be pre-initialized,

if (!LICENSE) {
  console.error("LICENSE is not set");
  console.error("LICENSE is not set");
  console.error("LICENSE is not set");
  console.error("LICENSE is not set");
}

//RUN ```export LICENSE="'<Base64_License>'";yarn start```; If you dont want to replace the LICENSE here.
let license = LICENSE;
console.log("license", license);
try {
  CardOcrSDK.preInitialize(license, {
    URL: {
      url: `${environment.url}/api/v1/pub_key`,
      headers: [
        {
          name: "LogAPITrigger",
          value: "true",
        },
        {
          name: "requestID",
          // We recommend to replace by a unique session id, to track session activity on IWS logs.
          value: "<REPLACE_BY_A_UNIQUE_SESSION_ID>",
        },
      ],
    },
  }).catch((err) => {
    if (err.code == 506) {
      alert(err.message);
    }
  });
} catch (error) {
  console.log(error);
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    "use strict";

    // @ts-ignore
    if (search instanceof RegExp) {
      throw TypeError("first argument must not be a RegExp");
    }
    if (start === undefined) {
      start = 0;
    }
    return this.indexOf(search, start) !== -1;
  };
}
