import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginContainerModule } from './LoginContainer/LoginContainer.component';
import { SidenavComponentModule } from './SidenavContainer/SidenavContainer.component';
import { BlogListComponentModule } from './BlogListContainer/BlogList/BlogList.component';
import { LandingPageComponentModule } from './landing-page.component';
import { LandingRoutingModule } from './landing.routing';

@NgModule({
  imports: [
    CommonModule,
    LoginContainerModule,
    SidenavComponentModule,
    BlogListComponentModule,
    LandingPageComponentModule,
    LandingRoutingModule
  ],
  declarations: []
})
export class LandingModule { }