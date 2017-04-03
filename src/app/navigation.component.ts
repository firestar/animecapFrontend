/**
 * Created by Nathaniel on 3/15/2017.
 */

import { Component, Input } from '@angular/core';
import { AccountService } from './database/account.service';
import { WSService } from './database/ws.service';
import { ControlService} from './database/control.service';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html'
})
export class TopNavigationBar {
  constructor(private accountService: AccountService, private ws: WSService, private control: ControlService){}
  @Input() title: string;
  instances=null;
  controlling;
  sessionKey;
  ngOnInit(){
    var self = this;
    self.controlling = self.control;
    let waitForAccount = function() {
      console.log("waiting, show index");
      if(self.accountService.checked) {
        self.sessionKey = self.accountService.sessionKey;
        self.ws.subscribe('/listen/listing', self.accountService.sessionKey, function(data){
          self.instances = JSON.parse(data.body).instances;
          self.control.removeOld(self.instances);
        });
      }else{
        setTimeout(function () {
          waitForAccount();
        }, 50);
      }
    }
    waitForAccount();
  }
  controlInstance(session){
    if(this.control.has()[session]){
      this.control.remove(session, this.accountService.sessionKey);
    }else{
      this.control.add(session, this.accountService.sessionKey);
    }
  }
}
