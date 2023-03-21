import { Component, NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
  }

}

@NgModule({
  imports:[RouterModule],
  declarations: [
    LandingPageComponent
  ],
  providers: [],
  exports:[LandingPageComponent]
})
export class LandingPageComponentModule { }
