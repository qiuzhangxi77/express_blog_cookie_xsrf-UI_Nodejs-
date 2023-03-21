import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleExtUrlResolverService {

constructor() { console.log('GoogleExtUrlResolverService start!');}
resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) :Observable<any> {
    window.location.href =  route.queryParamMap.get('url') as string;
    return of(null);
}

}
