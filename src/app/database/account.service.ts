/**
 * Created by Nathaniel on 3/15/2017.
 */

import { Injectable } from '@angular/core';
import {User} from "./models/user.model";
import { WatchObject } from 'watchobject';
import {HttpFetch} from './http.fetch';

@Injectable()
export class AccountService extends HttpFetch{
  data=null;
  private sessionCheck = "/api/session/get/";
  watch:WatchObject = null;

  private executorsWhenLoggedIn = [];
  constructor(){
    super();
    this.watch = new WatchObject();
    this.data = this.watcher().proxy({
      saved:null,
      checked:false,
      sessionKey:null
    });
  }

  executeWhenLoggedIn(func){
    var selfWrap = this;
    if(selfWrap.data.checked==true && selfWrap.data.sessionKey!=null){
      func();
    }
    this.executorsWhenLoggedIn.push(func);
  }
  set(account:User, session){
    this.data.sessionKey = session;
    if(account!=null) {
      this.data.saved = this.watcher().proxy(account);
      if(!this.data.checked) {
        this.executorsWhenLoggedIn.forEach(func => func());
        this.executorsWhenLoggedIn = [];
      }
      this.data.checked = true;
    }

  }
  user():User{
    return this.data.saved;
  }
  sessionKey(){
    return this.data.sessionKey;
  }
  checked(){
    return this.data.checked;
  }
  watcher(): WatchObject{
    return this.watch;
  }
}
