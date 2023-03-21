import { Injectable } from '@angular/core';

export interface userInformationFormat {
  username: string,
  realname: string,
  userID: string,
  GitHubID: string | undefined
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  
  private _userInformation:  userInformationFormat = {
    username: "",
    realname: "",
    userID: "",
    GitHubID: undefined
  };

 

  constructor() { }

  public set userInformation(data: userInformationFormat) {
    this._userInformation.username = data.username;
    this._userInformation.realname = data.realname;
    this._userInformation.userID = data.userID;
    if( data.GitHubID) {
      this._userInformation.GitHubID = data.GitHubID;
    }
  }

  public get userInformation() {
    return this._userInformation;
  }

  public bindGitHubID(GitHubID: string) {
    this._userInformation.GitHubID = GitHubID;
  }

  public clearUserInformation() {
    this._userInformation.username = "";
    this._userInformation.realname = "";
    this._userInformation.userID = "data.userID";
    this._userInformation.GitHubID = undefined;

  }


}
