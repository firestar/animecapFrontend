/**
 * Created by Nathaniel on 3/15/2017.
 */

import { Injectable } from '@angular/core';
import {User} from "./models/user.model";
import { WatchObject } from 'watchobject';

@Injectable()
export class AccountService{

  saved: User = null;
  watch:WatchObject = null;
  checked=false;
  sessionKey: string = null;
  set(account:User, session){
    this.watch = new WatchObject();
    this.saved = account;
    this.sessionKey = session;

  }
  get():User{
    return this.saved;
  }
}
