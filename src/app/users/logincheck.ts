/**
 * Created by Nathaniel on 3/15/2017.
 */
import { Injectable } from '@angular/core';
import { UserService } from '../database/user.service';
import { AccountService } from '../database/account.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable()
export class LoginCheck implements CanActivate {

  constructor( private userRepo: UserService, private router: Router, private account: AccountService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let self = this;
    let x = localStorage.getItem('session');
    if(x!=null) {

    }else{
      setTimeout(function() {
        self.router.navigate(['/login']);
      },400);
      return false;
    }
    return true;
  }
}
