import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { TitleBarComponent } from "./components/title-bar/title-bar.component";
import { TitleContextMenuComponent } from "./components/title-bar/title-context-menu/title-context-menu.component";
import {BsDropdownModule, CollapseModule, TabsModule, TabsetConfig, ButtonsModule} from "ngx-bootstrap";
import {FormsModule} from "@angular/forms";
import { SplashComponent } from "./components/title-bar/splash/splash.component";
import { ModalModule } from "ngx-bootstrap";
import { CommonModule } from "@angular/common";
import {SdkRunComponent} from "./components/sdk-run/sdk-run.component";
import {HttpClientModule} from "@angular/common/http";
import {Route, RouterModule} from "@angular/router";
import { IndexComponent } from "./components/index/index.component";
import {ProgressDialogComponent} from "./components/dialogs/progress-dialog/progress-dialog.component";
import {TransactionDialogComponent} from "./components/dialogs/transaction-dialog/transaction-dialog.component";
import {CardFaceSelectionComponent} from "./components/card-selection/card-face-selection.component";
import { TypeOfPipe, InstanceOfPipe } from './modules/helpers/type-of.pipe';
import {UserInputComponent} from "./components/dialogs/user-input/user-input.component";
import { IdTypeComponent } from './components/id-type/id-type.component';
import { NgxPrettyCheckboxModule } from 'ngx-pretty-checkbox';
import {OcrResultComponent} from "./components/dialogs/transaction-dialog/ocr-result/ocr-result.component";
import {FaceMatchComponent} from "./components/dialogs/transaction-dialog/face-match/face-match.component";
import { BarcodeComponent } from './components/dialogs/transaction-dialog/barcode/barcode.component';
import {MessageDialogComponent} from "./components/dialogs/message-dialog/message-dialog.component";
import {ValidationComponent} from "./components/dialogs/transaction-dialog/validation/validation.component";
import { CardFaceComponent } from './components/dialogs/card-face/card-face.component';
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatInputModule} from "@angular/material/input";
import {MatDividerModule} from "@angular/material/divider";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {MatAnchor, MatButton, MatButtonModule} from "@angular/material/button";

const routes: Route[] = [
  {
    path: "",
    redirectTo: "app",
    pathMatch: "full"
  },
  {
    path: "app", component: IndexComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    TitleBarComponent,
    TitleContextMenuComponent,
    SplashComponent,
    SdkRunComponent,
    IndexComponent,
    ProgressDialogComponent,
    TransactionDialogComponent,
    CardFaceSelectionComponent,
    TypeOfPipe,
    InstanceOfPipe,
    UserInputComponent,
    IdTypeComponent,
    OcrResultComponent,
    FaceMatchComponent,
    BarcodeComponent,
    MessageDialogComponent,
    ValidationComponent,
    CardFaceComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forRoot(routes, {enableTracing: false, relativeLinkResolution: 'legacy'}),
    FormsModule,
    TabsModule,
    ButtonsModule,
    NgxPrettyCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatRadioModule,
    MatSelectModule,
    MatToolbarModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule
  ],
  providers: [TabsetConfig],
  entryComponents: [ProgressDialogComponent, TransactionDialogComponent, UserInputComponent, CardFaceComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
