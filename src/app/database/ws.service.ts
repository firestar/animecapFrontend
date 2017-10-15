/**
 * Created by Nathaniel on 3/31/2017.
 */
import { Injectable } from '@angular/core';
import { WatchObject } from 'watchobject';

@Injectable()
export class WSService{
  constructor () {}
  private socket;
  private watchObject;
  private stompClient = null;
  private stompClientProxied = null;
  private subscriptions = {};

  private connected = function(){
    console.log("this is now connected!");
  }
  initialize(url:string, func){
    var self = this;
    var SocketJS = require('sockjs-client');
    var Stomp = require('stompjs');
    self.socket = new SocketJS(url);
    self.watchObject = new WatchObject();
    self.stompClientProxied = Stomp.over(self.socket);
    self.stompClient = self.watchObject.watch(self, self.stompClientProxied, "connected", "set", function(obect, key, oldValue, newValue){
      return newValue==1;
    }, function(parent, obect, key, oldValue, newValue){
      parent.connected();
    });
    self.stompClient.reconnect_delay = 5000;
    self.stompClient.connect({},function(data){
      func(self.stompClient, data);
    });
  }
  subscribe(target, session, func){
    this.subscriptions[target]=this.client().subscribe(target+"/"+session, func);
  }
  unsubscribe(target){
    if(this.subscriptions[target]) {
      this.subscriptions[target].unsubscribe();
      delete this.subscriptions[target];
    }
  }
  client(){
    return this.stompClient;
  }
  clientProxied(){
    return this.stompClientProxied;
  }
  watcher(){
    return this.watchObject;
  }
}
