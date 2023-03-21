import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ExtUrlResolverService implements Resolve<any> {
constructor() { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) :Observable<any> {
    window.location.href =  route.queryParamMap.get('url') as string;
    return of(null);
  }
}
