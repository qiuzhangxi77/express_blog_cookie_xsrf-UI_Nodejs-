import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GitHubExtUrlResolverService implements Resolve<any> {
    constructor() {
        console.log('GitHubExtUrlResolverService start!');
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        window.location.href = route.queryParamMap.get('url') as string;
        return of(null);
    }
}
