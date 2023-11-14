/**
 * Created by Nathaniel on 3/12/2017.
 */
import { Component, Input } from '@angular/core';
import { UserService } from '../../database/user.service';
import { Router } from '@angular/router';
import { AccountService } from '../../database/account.service';
import { Group_WSService } from '../../database/websocket/group.service';
import {EnvironmentService} from '../../database/env.service';

@Component({
  selector: 'login-form',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginForm {

  constructor(public envService:EnvironmentService, private userRepo: UserService, private router: Router, private account: AccountService, private gws: Group_WSService){}

  //on load
  ngOnInit(){
    let self = this;
    let x = localStorage.getItem('session');
    if(x!=null) {
      this.userRepo.session(x, function (response) {
        if (response.code) {
          localStorage.removeItem("session");
        } else {
          self.account.set(response.data.account, response.key);
          self.account.data.checked=true;
          self.timeout = setTimeout(function() {
            self.router.navigate(['/']);
          },20);
        }
      });
    }
  }
  @Input() username : string = "";
  password : string = "";
  message : string = "";
  timeout;
  session;
  loginButton: string = "Login";

  executeLogin(){
    this.loginButton = "Logging in.....";
    let self = this;
    this.userRepo.login( this.username, this.password, function(response){
      if(response.code){
        self.message = response.message;
        self.loginButton = "Login";
        clearTimeout(self.timeout);
        self.timeout = setTimeout(function() {
          self.message = "";
        },5000);
      }else{
        clearTimeout(self.timeout);
        self.message = "Welcome back "+response.account.data.user;
        self.loginButton = "Success";
        self.session = response.session.key;
        localStorage.setItem("session", response.session.key);
        self.account.set(response.account, self.session);
        self.account.data.checked=true;
        self.timeout = setTimeout(function() {
          self.router.navigate(['/']);
        },1500);
      }
    })
  }
}
