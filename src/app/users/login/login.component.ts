/**
 * Created by Nathaniel on 3/12/2017.
 */
import { Component, Input } from '@angular/core';
import { UserService } from '../../database/user.service';
import { Router } from '@angular/router';
import { AccountService } from '../../database/account.service';
import { WSService } from '../../database/websocket/ws.service';

@Component({
  selector: 'login-form',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginForm {

  constructor(private userRepo: UserService, private router: Router, private account: AccountService, private ws: WSService){}

  //on load
  ngOnInit(){
    let self = this;
    let x = localStorage.getItem('session');
    if(x!=null) {
      this.userRepo.session(x, function (response) {
        if (response.code) {
          localStorage.removeItem("session");
        } else {
          self.account.set(response.account, response.sessionKey);
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
        self.message = "Welcome back "+response.account.user;
        self.loginButton = "Success";
        self.session = response.sessionKey;
        localStorage.setItem("session", self.session);
        self.account.set(response.account, self.session);
        self.account.data.checked=true;
        self.timeout = setTimeout(function() {
          self.router.navigate(['/']);
        },1500);
      }
    })
  }
}
