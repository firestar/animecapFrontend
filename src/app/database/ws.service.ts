/**
 * Created by Nathaniel on 3/31/2017.
 */
import { Injectable } from '@angular/core';


@Injectable()
export class WSService{
  constructor () {}
  private socket;
  private stompClient=null;
  private subscriptions = {};

  initialize(url:string, func){
    var self = this;
    var SocketJS = require('sockjs-client');
    var Stomp = require('stompjs');
    self.socket = new SocketJS(url);
    self.stompClient = Stomp.over(self.socket);
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
}
