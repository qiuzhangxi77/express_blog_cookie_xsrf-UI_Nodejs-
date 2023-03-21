import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Routes, RouterModule } from '@angular/router';
import { GitHubAuthComponent } from 'src/app/libs/Oauth2/GitHub/Auth/GitHubAuth.component';
import { GitHubRedirectComponent } from 'src/app/libs/Oauth2/GitHub/Redirect/GitHubRedirect.component';
import { GoogleAuthComponent } from 'src/app/libs/Oauth2/Google/Auth/GoogleAuth/GoogleAuth.component';
import { GoogleRedirectComponent } from 'src/app/libs/Oauth2/Google/Redirect/GoogleRedirect/GoogleRedirect.component';
import { IsAuthenticatedService } from 'src/service/is-authenticated/is-authenticated.service';
import { LoggedInGuardService } from 'src/service/logged-in-guard/logged-in-guard.service';
import { GitHubExtUrlResolverService } from 'src/service/OAuthService/GitHubExtUrlResolver.service';
import { GoogleExtUrlResolverService } from 'src/service/OAuthService/GoogleExtUrlResolver.service';
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
    canActivate: [IsAuthenticatedService]
  },
  {
    path:'login',
    component: LoginContainerComponent,
    canActivate: [IsAuthenticatedService]
  },
  {
    path:'register',
    component: RegisterContainerComponent,
  },
  //用于Oauth2的RedirectComponent 
  {
    path:'GitHubRedirect',
    component: GitHubRedirectComponent
  },
  {
    // a dummy component GitAuthComponent corresponding to this path.
    // because it doesnt do any work. We need this component just for the sake of navigation.
    path:'GitHubAuth',
    component: GitHubAuthComponent,
    resolve: {
      url: GitHubExtUrlResolverService
    }
  },
  {
    path:'GoogleRedirect',
    component: GoogleRedirectComponent
  },
  {
    // a dummy component GitAuthComponent corresponding to this path.
    // because it doesnt do any work. We need this component just for the sake of navigation.
    path:'GoogleAuth',
    component: GoogleAuthComponent,
    resolve: {
      url: GoogleExtUrlResolverService
    }
  },
  {
    path: ':contextIndex',
    component: SidenavComponent,
    canActivate: [LoggedInGuardService],
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
