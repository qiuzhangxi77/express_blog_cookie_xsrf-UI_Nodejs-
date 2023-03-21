import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Routes, RouterModule } from '@angular/router';
import { GitAuthComponent } from 'src/app/component/GitAuth/GitAuth.component';
import { RedirectComponent } from 'src/app/component/Redirect/Redirect.component';
import { IsAuthenticatedService } from 'src/service/is-authenticated/is-authenticated.service';
import { LoggedInGuardService } from 'src/service/logged-in-guard/logged-in-guard.service';
import { ExtUrlResolverService } from 'src/service/OAuthService/ExtUrlResolver.service';
import { BlogListComponent } from './BlogListContainer/BlogList/BlogList.component';
import { LandingPageComponent } from './landing-page.component';
import { LandingModule } from './Landing.module';
import { LoginContainerComponent } from './LoginContainer/LoginContainer.component';
import { MyBlogComponent } from './MyBlogContainer/MyBlog/MyBlog.component';
import { RegisterContainerComponent } from './RegisterContainer/RegisterContainer.component';
import { SidenavComponent } from './SidenavContainer/SidenavContainer.component';

const routes: Routes = [
  {
    path:'',
    component: LandingPageComponent,
    // canActivate: [IsAuthenticatedService]
  },
  {
    path:'login',
    component: LoginContainerComponent,
    // canActivate: [IsAuthenticatedService]
  },
  {
    path:'register',
    component: RegisterContainerComponent,
  },
  //用于Oauth2的RedirectComponent 
  {
    path:'redirect',
    component: RedirectComponent
  },
  {
    path:'test',
    resolve: {
      url: ExtUrlResolverService
    }
  },
  {
    path:'gitLoginPage',
    component: GitAuthComponent
  },
  {
    path: ':contextIndex',
    component: SidenavComponent,
    // canActivate: [LoggedInGuardService],
    children: [
      {
        path:'home',
        redirectTo: 'api/blog-list',
        pathMatch: 'full'
      },
      {
        path:'api/blog-list',
        component: BlogListComponent
      },
      {
        path:'api/myBlog-list',
        component: MyBlogComponent
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
