import { Component } from '@angular/core';
import { UserService } from './database/user.service';
import { AccountService } from './database/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AnimeCap';
  session = localStorage.getItem("session");
  constructor( private userRepo: UserService, private account: AccountService) { }

  ngOnInit() {
    var platform = require('platform');
    console.log(platform);
    let self = this;
    let x = localStorage.getItem('session');
    if(x!=null) {
      this.userRepo.session(x, function (response) {
        if (response.code) {
          localStorage.removeItem("session");
        }else{
          self.account.set(response.account, response.sessionKey);
        }
        self.account.checked=true;
      });
    }
  }
}
