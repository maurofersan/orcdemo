import { Component, OnInit } from '@angular/core';
//@ts-ignore
import * as slash_png from '../../../../assets/images/identy_logos_rgb_blue.png';
@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {

  constructor() { }
  public readonly splash = slash_png['default'];
  ngOnInit() {
  }

}
