/**
 * Created by Nathaniel on 3/16/2017.
 */
import { Component, Input } from '@angular/core';
import { UserService } from '../database/user.service';
import { Router } from '@angular/router';
import { AccountService } from '../database/account.service';

@Component({
  selector: 'logout-action',
  template: 'Logging Out....'
})
export class LogoutSend {

  constructor(private userRepo: UserService, private router: Router, private account: AccountService){}

  //on load
  ngOnInit(){
    let self = this;
    let x = localStorage.getItem('session');
    if(x!=null) {
      self.userRepo.logout(x, function (response) {
        localStorage.removeItem("session");
        //self.account.set(null, null);

        setTimeout(function(){
          location.href="/login";
          //self.router.navigate(['/login']);
        },500);
      });
    }else{
      setTimeout(function(){
        self.router.navigate(['/login']);
      },500);
    }
  }
}
