import { Component } from '@angular/core';
import { UserService } from './database/user.service';
import { AccountService } from './database/account.service';
import { WSService } from './database/ws.service';
import { ControlService} from './database/control.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AnimeCap';
  session = localStorage.getItem("session");
  constructor( private userRepo: UserService, private account: AccountService, private ws: WSService, private control: ControlService, private router: Router ) { }
  waitForWS() {
    let self = this;
    if(self.ws.client().connected) {
      self.control.setWS(self.ws);
      if (self.session != null) {
        this.userRepo.session(self.session, function (response) {
          if (response.code) {
            localStorage.removeItem("session");
          } else {
            self.account.set(response.account, response.sessionKey);
          }
          self.account.checked = true;
        });
      }
      self.waitForAccount();
    }else{
      setTimeout(function () {
        self.waitForWS();
      }, 50);
    }
  }
  waitForAccount() {
    let self = this;
    if(self.account.checked && self.account.sessionKey!=null) {
      self.session = self.account.sessionKey;
      self.ws.subscribe('/listen/session', self.session, function(){
        self.sendSessionKey();
      });
      self.ws.subscribe('/listen/remote', self.session, function(){
        if(self.control.slave) {
          self.control.slave = true;
          self.router.navigate(['/slave']);
        }
      });
      self.sendSessionKey();
    }else{
      setTimeout(function () {
        self.waitForAccount();
      }, 50);
    }
  }
  sendSessionKey(){
    let self = this;
    var platform = require('platform');
    self.ws.client().send('/call/session', {}, JSON.stringify({session: self.session, platform: platform.name+"-"+platform.os.family}));
  }
  ngOnInit() {

    let self = this;
    self.ws.initialize('https://api.animecap.com/websocket',function(client, data){
      console.log(client);

    });
    self.waitForWS();
  }
}
