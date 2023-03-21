import { Injectable } from '@angular/core';

export interface userInformationFormat {
  username: string,
  realname: string,
  userID: string,
  oauthID: string | undefined,
  oauth: string | undefined,
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  
  private _userInformation:  userInformationFormat = {
    username: '',
    realname: '',
    userID: '',
    oauthID: undefined,
    oauth: ''
  };

 

  constructor() { }

  public set userInformation(data: userInformationFormat) {
    this._userInformation.username = data.username;
    this._userInformation.realname = data.realname;
    this._userInformation.userID = data.userID;
    if( data.oauthID) {
      this._userInformation.oauthID = data.oauthID;
    }
    if( data.oauth) {
      this._userInformation.oauth = data.oauth;
    }
  }

  public get userInformation() {
    return this._userInformation;
  }

  public bindOauth(GitHubID: string, oauth: string) {
    this._userInformation.oauthID = GitHubID;
    this._userInformation.oauth = oauth;
  }

  public clearUserInformation() {
    this._userInformation.username = '';
    this._userInformation.realname = '';
    this._userInformation.userID = 'data.userID';
    this._userInformation.oauthID = undefined;
    this._userInformation.oauth = undefined;
  }


}
