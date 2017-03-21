
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';


@Injectable()
export class UserService{
  constructor (private http: Http) {}

  private authLogin = "http://api.animecap.com/auth/login";
  private authLogout = "http://api.animecap.com/auth/logout";
  private authRegister = "http://api.animecap.com/auth/register";
  private authSession = "http://api.animecap.com/auth/session";

  login(username : string, password: string, func){
    this.fetchURLPost(this.authLogin,{user:username,pass:password}, function(body){
      func( body );
    });
  }
  session(sessionKey: string, func){
    this.fetchURLPost(this.authSession,{session: sessionKey}, function(body){
      func( body );
    });
  }
  logout(sessionKey: string, func){
    this.fetchURLPost(this.authLogout,{session: sessionKey}, function(body){
      func( body );
    });
  }
  register(username : string, password: string, func){
    this.fetchURLPut(this.authRegister,{user:username,pass:password}, function(body){
      func( body );
    });
  }
  fetchURLPost(url, data, func){
    return this.http.post(url, data, {}).subscribe((res:Response) =>  func(res.json()))
  }
  fetchURLPut(url, data, func){
    return this.http.put(url, data, {}).subscribe((res:Response) =>  func(res.json()))
  }
}
