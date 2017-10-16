/**
 * Created by Nathaniel on 3/15/2017.
 */

import { Injectable } from '@angular/core';
import {User} from "./models/user.model";
import { WatchObject } from 'watchobject';

@Injectable()
export class AccountService{
  data=null;
  watch:WatchObject = null;
  constructor(){
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
    selfWrap.watcher().watch(self, selfWrap.data, "sessionKey|checked", "set", function(object, key, oldValue, newValue) {
      object[key] = newValue;
      return object.checked==true && object.sessionKey!=null;
    }, function(parent, object, key, oldValue, newValue, id, keys){
      if(selfWrap.watcher().remove(selfWrap.data, keys, 'set', id)){
        console.log("=========== removed observe on "+keys+" for object with id: "+object._uniqueIdentifier);
      }
      func();
    });
  }
  set(account:User, session){
    if(account!=null) {
      this.data.saved = this.watcher().proxy(account);
    }
    this.data.sessionKey = session;
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
