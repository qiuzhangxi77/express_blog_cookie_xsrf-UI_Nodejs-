import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { myIp } from '../settings';
import { myDomain } from '../settings';

@Injectable({
    providedIn: 'root',
})
export class OAuthServiceService {
    constructor(private http: HttpClient) {}

    // GitHub Oauth2
    getGitHubAuthPage(): Observable<any> {
        // const endpoint = 'http://localhost:4005/api/oauth/GitHubAuthPage';
        // const endpoint = 'http://8.218.114.58:3000/api/oauth/GitHubAuthPage';
        // const endpoint = 'http://duxingxia77.ink:3000/api/oauth/GitHubAuthPage';
        const endpoint = `${myDomain}/api/oauth/GitHubAuthPage`;
        return this.http.get(endpoint, { withCredentials: true }).pipe(
            map((res: any) => {
                return res;
            })
        );
        // .toPromise();
    }

    getGitHubAccessToken(auth_code: string) {
        // const endpoint = 'http://localhost:4005/api/oauth/GitHubGetAccessToken';
        // const endpoint = 'http://8.218.114.58:3000/api/oauth/GitHubGetAccessToken';
        // const endpoint = 'http://duxingxia77.ink:3000/api/oauth/GitHubGetAccessToken';
        const endpoint = `${myDomain}/api/oauth/GitHubGetAccessToken`;
        return this.http
            .post(endpoint, { code: auth_code }, { withCredentials: true })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    getGitHubUserDetailsToLogin() {
        // const endpoint = 'http://localhost:4005/api/oauth/loginByGitHub';
        // const endpoint = 'http://8.218.114.58:3000/api/oauth/loginByGitHub';
        // const endpoint = 'http://duxingxia77.ink:3000/api/oauth/loginByGitHub';
        const endpoint = `${myDomain}/api/oauth/loginByGitHub`;
        return this.http
            .get(endpoint, { withCredentials: true })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    getGitHubUserDetailsToBind(userID: string) {
        // const endpoint = `http://localhost:4005/api/oauth/bindByGitHub/${userID}`;
        // const endpoint = `http://8.218.114.58:3000/api/oauth/bindByGitHub/${userID}`;
        // const endpoint = `http://duxingxia77.ink:3000/api/oauth/bindByGitHub/${userID}`;
        const endpoint = `${myDomain}/api/oauth/bindByGitHub/${userID}`;
        return this.http
            .get(endpoint, { withCredentials: true })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    // Google Oauth2
    getGoogleAuthPage(): Observable<any> {
        // const endpoint = 'http://localhost:4005/api/oauth/GoogleAuthPage';
        // const endpoint = 'http://8.218.114.58:3000/api/oauth/GoogleAuthPage';
        // const endpoint = 'http://duxingxia77.ink:3000/api/oauth/GoogleAuthPage';
        const endpoint = `${myDomain}/api/oauth/GoogleAuthPage`;
        return this.http.get(endpoint, { withCredentials: true }).pipe(
            map((res: any) => {
                return res;
            })
        );
        // .toPromise();
    }

    getGoogleAccessToken(auth_code: string) {
        // const endpoint = 'http://localhost:4005/api/oauth/GoogleGetAccessToken';
        // const endpoint = 'http://8.218.114.58:3000/api/oauth/GoogleGetAccessToken';
        // const endpoint = 'http://duxingxia77.ink:3000/api/oauth/GoogleGetAccessToken';
        const endpoint = `${myDomain}/api/oauth/GoogleGetAccessToken`;
        console.log('getGoogleAccessToken code: ', auth_code);
        return this.http
            .post(endpoint, { code: auth_code }, { withCredentials: true })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    getGoogleUserDetailsToLogin() {
        // const endpoint = 'http://localhost:4005/api/oauth/loginByGoogle';
        // const endpoint = 'http://8.218.114.58:3000/api/oauth/loginByGoogle';
        // const endpoint = 'http://duxingxia77.ink:3000/api/oauth/loginByGoogle';
        const endpoint = `${myDomain}/api/oauth/loginByGoogle`;
        return this.http
            .get(endpoint, { withCredentials: true })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    getGoogleUserDetailsToBind(userID: string) {
        // const endpoint = `http://localhost:4005/api/oauth/bindByGoogle/${userID}`;
        // const endpoint = `http://8.218.114.58:3000/api/oauth/bindByGoogle/${userID}`;
        // const endpoint = `http://duxingxia77.ink:3000/api/oauth/bindByGoogle/${userID}`;
        const endpoint = `${myDomain}/api/oauth/bindByGoogle/${userID}`;
        return this.http
            .get(endpoint, { withCredentials: true })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }
}
