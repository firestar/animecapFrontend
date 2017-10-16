/**
 * Created by Nathaniel on 3/15/2017.
 */
import { Component, Input } from '@angular/core';
import { UserService } from '../../database/user.service';
import { Router } from '@angular/router';
import { AccountService } from '../../database/account.service';

@Component({
  selector: 'register-form',
  templateUrl: 'register.component.html'
})
export class RegisterForm {

  constructor(private userRepo: UserService, private router: Router, private account: AccountService){}

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

  @Input() username: string = "";
  password: string = "";
  message: string = "";
  timeout;
  password2: string = "";
  registerButton: string = "Register";
  executeRegister(){
    this.registerButton = "Registering account...";
    let self = this;
    if(this.password.trim().length<5){
      this.registerButton = "Register";
      this.message = "Password needs to be at-least 5 characters long!";
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function() {
        self.message = "";
      },5000);
      return;
    }
    if(this.password==this.password2) {
      this.userRepo.register(this.username, this.password, function (response) {
        if (response.code) {
          self.message = response.message;
          self.registerButton = "Register";
          clearTimeout(self.timeout);
          self.timeout = setTimeout(function() {
            self.message = "";
          },5000);
        } else {
          clearTimeout(self.timeout);
          self.message = "Successfully created account and logged into account [" + response.account.user + "] with the session code " + response.sessionKey;
          self.registerButton = "Success";
          self.account.set(response.account, response.sessionKey);
          self.account.data.checked=true;
          localStorage.setItem("session", response.sessionKey);
          self.router.navigate(['/']);
        }
      })
    }else{
      this.registerButton = "Register";
      this.message = "Passwords do not match!";
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function() {
        self.message = "";
      },5000);
    }
  }
}
