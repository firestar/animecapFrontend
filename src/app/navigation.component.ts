/**
 * Created by Nathaniel on 3/15/2017.
 */

import { Component, Input } from '@angular/core';
import { AccountService } from './database/account.service';
import { Group_WSService } from './database/websocket/group.service';
import { Remote_WSService } from './database/websocket/remote.service';
import { ControlService } from './database/control.service';
import { GroupService } from './database/group.service';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html'
})
export class TopNavigationBar {
  constructor(public accountService: AccountService, public rws: Remote_WSService, public gws: Group_WSService, public control: ControlService, public group: GroupService){}
  @Input() title: string;
  controlling;
  controllerWS;
  sessionKey;
  groupService = null;
  ngOnInit(){
    const self = this;
    self.controllerWS = self.rws;
    self.groupService = self.group;
    self.controlling = self.control;
    self.accountService.executeWhenLoggedIn(function(){
      self.sessionKey = self.accountService.sessionKey();
    });
  }
  controlInstance(session){
    if(this.control.has()[session]){
      this.control.remove(session, this.accountService.sessionKey());
    }else{
      this.control.add(session, this.accountService.sessionKey());
    }
  }
}
