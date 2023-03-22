import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

// Note: 跨域设置cookie问题
// 前端要配置http的方法 withCredentials: true
//后端要设置跨域访问
// res.setHeader('Access-Control-Allow-Origin',req.headers.origin)
// res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization')
// res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS,DELETE')
// res.setHeader('Access-Control-Allow-Credentials',true)
//nginx做反向代理

@Injectable({
    providedIn: 'root',
})
export class AccountApiServiceService {
    constructor(private _http: HttpClient) {}

    /**
     * Sends to API gateway to login.
     */
    public login(user: any): Promise<any> {
        const endpoint = 'http://localhost:8000/api/user/login';
        return this._http
            .post(endpoint, user, { withCredentials: true })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    public logout() {
        const endpoint = 'http://localhost:8000/api/user/logout';
        return this._http
            .get(endpoint, { withCredentials: true })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    public loginTest(): Promise<any> {
        const endpoint = 'http://localhost:8000/api/user/login-test';
        return this._http
            .get(endpoint, { withCredentials: true })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    /**
     * Makes a request to CS to retrieve data for the current user.
     * If the user is logged in the data is stored for later use.
     */
    public getUserData() {
        const endpoint = 'http://localhost:8000/api/user/userInfo';
        return this._http
            .get(endpoint, {
                withCredentials: true,
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    public getBlogList() {
        const endpoint = 'http://localhost:8000/api/blog/list';
        return this._http
            .get(endpoint, {
                withCredentials: true,
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    public getMyBlogList(userID: string) {
        const endpoint = `http://localhost:8000/api/blog/list/${userID}`;
        return this._http
            .get(endpoint, {
                withCredentials: true,
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    public register(userInformation: any) {
        const endpoint = 'http://localhost:8000/api/user/register';
        return this._http
            .post(endpoint, userInformation, {
                withCredentials: true,
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    public newBlog(data: any) {
        const endpoint = `http://localhost:8000/api/blog/${data.userID}/new`;
        return this._http
            .post(endpoint, data, {
                withCredentials: true,
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    public updateBlog(data: any) {
        const endpoint = `http://localhost:8000/api/blog/${data.userID}/${data.blogID}`;
        return this._http
            .put(endpoint, data, {
                withCredentials: true,
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }

    public deleteBlog(data: any) {
        const endpoint = `http://localhost:8000/api/blog/${data.userID}/${data.blogID}`;
        return this._http
            .delete(endpoint, {
                withCredentials: true,
            })
            .pipe(
                map((res: any) => {
                    return res;
                })
            )
            .toPromise();
    }
}
