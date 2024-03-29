
import { Injectable } from '@angular/core';
import {HttpFetch} from './http.fetch';


@Injectable()
export class UserService extends HttpFetch{

  private authLogin = "/api/auth/login";
  private authLogout = "/api/auth/logout";
  private authRegister = "/api/auth/register";
  private authSession = "/api/auth/session";

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
}
