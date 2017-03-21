/**
 * Created by Nathaniel on 3/15/2017.
 */

import { Injectable } from '@angular/core';
import {User} from "./models/user.model";


@Injectable()
export class AccountService{
  saved: User = null;
  checked=false;
  sessionKey: string = null;
  set(account:User, session){
    this.saved = account;
    this.sessionKey = session;
  }
  get():User{
    return this.saved;
  }
}
