import { Component } from '@angular/core';
import { UserService } from './database/user.service';
import { AccountService } from './database/account.service';
import { Group_WSService } from './database/websocket/group.service';
import { ControlService} from './database/control.service';
import { GroupService } from './database/group.service';
import { Remote_WSService } from './database/websocket/remote.service';
import { EventService} from "./database/event.service";
import {Router} from "@angular/router";
import { PushNotificationsService } from 'angular2-notifications';
import { WatchObject } from 'watchobject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AnimeCap';
  private watcher = null;
  session = localStorage.getItem("session");
  constructor( private userRepo: UserService, private account: AccountService, private es: EventService, private rws: Remote_WSService, private gws: Group_WSService, private control: ControlService, private router: Router, private group: GroupService, private _pushNotifications: PushNotificationsService ) {}

  accountSet(self){
    self.rws.subscribe('/listen/session', self.session, function(){
      self.sendSessionKey();
    });
    self.rws.subscribe('/listen/remote', self.session, function(data){
      let session = JSON.parse(data.body)[0];
      self.control.controller = session;
      if(!self.control.slave) {
        self.control.slave = true;
        self.router.navigate(['/slave']);
      }
    });
    self.rws.subscribe('/listen/release', self.session, function(){
      if(self.control.slave) {
        self.control.slave = false;
        self.router.navigate(['/']);
      }
    });
    self.rws.subscribe('/listen/new_favorite', self.session, function(data){
      let episode = JSON.parse(data.body);
      self._pushNotifications.create(episode.show.title+' Episode '+episode.episode.episode+' Just Released!', { data:episode, sticky: true, body: 'Click to go to episode', 'icon':'https://vid.animecap.com/'+episode.source.original+'_100x70.png'}).subscribe(
        res => {
          if(res.event.type=="click"){
            res.notification.close();
            window.open('//animecap.com/watch/'+res.notification.data.episode.id+'/'+res.notification.data.show.title.toLowerCase().split(' ').join('_')+'/episode_'+res.notification.data.episode.episode, '_blank');
          }
        },
        err => console.log(err)
      );
    });
  }
  sendSessionKey(){
    let self = this;
    var platform = require('platform');
    // send to remote control ws
    self.rws.client().send('/call/session', {}, JSON.stringify({session: self.session, platform: platform.name+"-"+platform.os.family}));
  }

  setIfNotSet(key, defaultValue){
    if(!localStorage.getItem(key)){
      localStorage.setItem(key, defaultValue);
    }
  }
  ngOnInit() {
    let self = this;
    self.es.emitter.on("accountReceived", () => {

    });
    self.es.emitter.on("apiWSConnected", () => {

    });
    self.es.emitter.on("remoteWSConnected", () => {

    });
    self._pushNotifications.requestPermission();
    self.setIfNotSet("goToNextVideoOnComplete","true");
    self.setIfNotSet("percentToComplete", "97");
    self.setIfNotSet("videoSource","sd");
    self.setIfNotSet("goToShowPageOnComplete", "false");
    self.rws.initialize('//animecap.com/site/websocket/remote',function(client, data){

    });
    self.gws.initialize('//animecap.com/socket/groupwatch',function(client, data){

    });
    if (self.session != null) {
      self.userRepo.session(self.session, function (response) {
        if (response.code) {
          localStorage.removeItem("session");
        } else {
          self.account.set(response.account, response.sessionKey);
        }
        self.account.data.checked = true;
      });
    }
    self.group.setWS(self.gws);
    self.gws.executeWhenConnected(function(){
      console.log("Connected to group websocket");
    });
    self.control.setWS(self.rws);
    self.rws.executeWhenConnected(function(){
      console.log("Connected to remote control websocket");
      self.account.executeWhenLoggedIn(function () {
        self.accountSet(self);
        self.sendSessionKey();
        self.rws.controller = self.control;
        self.rws.register(self.account.sessionKey());
      })
    });

  }
}
