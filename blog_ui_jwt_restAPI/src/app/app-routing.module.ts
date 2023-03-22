import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAuthenticatedService } from 'src/service/is-authenticated/is-authenticated.service';
import { LandingPageComponent } from './page/landing-page/landing-page.component';

const routes: Routes = [
    // {
    //   path:'',
    //   component: LandingPageComponent,
    // },
    {
        path: '',
        loadChildren: () => import('./page/landing-page').then((m) => m.LandingModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
// export const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes);
