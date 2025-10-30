import { Injectable } from "@angular/core";
import {Subject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DataHelperService {

  public isloggedIn: boolean;
  public loginSub: Subject<boolean>;
  public santander: Boolean;


  constructor() {

    this.loginSub = new Subject();

    this.bind();
  }


  private bind() {

  }

}
