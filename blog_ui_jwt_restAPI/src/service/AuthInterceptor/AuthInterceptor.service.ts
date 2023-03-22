import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//     constructor(private _tokenExtractor: HttpXsrfTokenExtractor) {}

//     intercept(req: HttpRequest<any>,
//         next: HttpHandler): Observable<HttpEvent<any>> {
//             const jwtToken = localStorage.getItem("jwt_token");
//             console.log('AuthInterceptor-jwtToken: ', jwtToken);
//             if (jwtToken) {
//                 req = req.clone({
//                     headers: req.headers.set("Authorization",
//                         "Bearer " + jwtToken)
//                  });
//             };

//         return next.handle(req);
//     }
// }

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private _tokenExtractor: HttpXsrfTokenExtractor) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headerName = 'X-XSRF-TOKEN';
        const token = this._tokenExtractor.getToken();
        console.log(' put xsrf-token to x-xsrf-token: ', token);
        if (token) {
            req = req.clone({
                headers: req.headers.set(headerName, token),
            });
        }

        return next.handle(req);
    }
}
