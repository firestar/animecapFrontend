import { Component } from '@angular/core';
import { UserService } from './database/user.service';
import { AccountService } from './database/account.service';
import { WSService } from './database/ws.service';
import { ControlService} from './database/control.service';
import { GroupService } from './database/group.service';
import {Router} from "@angular/router";
import { PushNotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AnimeCap';
  session = localStorage.getItem("session");
  constructor( private userRepo: UserService, private account: AccountService, private ws: WSService, private control: ControlService, private router: Router, private group: GroupService, private _pushNotifications: PushNotificationsService ) { }
  waitForWS() {
    let self = this;
    if(self.ws.client().connected) {
      self.control.setWS(self.ws);
      self.group.setWS(self.ws);
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
      self.ws.subscribe('/listen/remote', self.session, function(data){
        let session = JSON.parse(data.body)[0];
        self.control.controller = session;
        if(!self.control.slave) {
          self.control.slave = true;
          self.router.navigate(['/slave']);
        }
      });

      self.ws.subscribe('/listen/new_favorite', self.session, function(data){
        let episode = JSON.parse(data.body);
        self._pushNotifications.create(episode.show.title+' Episode '+episode.episode.episode+' Just Released!', { data:episode, sticky: true, body: 'Click to go to episode', 'icon':'https://vid.animecap.com/'+episode.source.original+'_100x70.png'}).subscribe(
          res => {
            if(res.event.type=="click"){
              res.notification.close();
              window.open('http://animecap.com/watch/'+res.notification.data.episode.id+'/'+res.notification.data.show.title.toLowerCase().split(' ').join('_')+'/episode_'+res.notification.data.episode.episode, '_blank');
            }
          },
          err => console.log(err)
      );
      });
      self.ws.subscribe('/listen/release', self.session, function(){
        if(self.control.slave) {
          self.control.slave = false;
          self.router.navigate(['/']);
        }
      });
      self.sendSessionKey();
    }else{
      setTimeout(function () {
        self.waitForAccount();
      }, 100);
    }
  }
  sendSessionKey(){
    let self = this;
    var platform = require('platform');
    self.ws.client().send('/call/session', {}, JSON.stringify({session: self.session, platform: platform.name+"-"+platform.os.family}));
  }
  setIfNotSet(key, defaultValue){
    if(!localStorage.getItem(key)){
      localStorage.setItem(key, defaultValue);
    }
  }
  ngOnInit() {
    let self = this;
    self._pushNotifications.requestPermission();
    self.setIfNotSet("goToNextVideoOnComplete","true");
    self.setIfNotSet("percentToComplete", "97");
    self.setIfNotSet("videoSource","sd");
    self.setIfNotSet("goToShowPageOnComplete", "false");
    self.ws.initialize('/site/websocket',function(client, data){

    });
    self.waitForWS();
  }
}
