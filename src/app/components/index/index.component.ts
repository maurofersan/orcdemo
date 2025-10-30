import { Component, OnInit } from "@angular/core";
import {Router} from "@angular/router";
import {ContextMenuHelperService} from "../title-bar/title-context-menu/context-menu-helper.service";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"]
})
export class IndexComponent implements OnInit {

  constructor(private router: Router, public context_menu_helper: ContextMenuHelperService) { }

  ngOnInit() {}

}
