/**
 * Created by Nathaniel on 3/31/2017.
 */
import { Injectable } from '@angular/core';
import { WatchObject } from 'watchobject';

@Injectable()
export class Group_WSService{
  constructor () {}
  private socket;
  private watchObject;
  private stompClient = null;
  private stompClientProxied = null;
  private subscriptions = {};
  initialize(url:string, func){
    var self = this;
    var SocketJS = require('sockjs-client');
    var Stomp = require('stompjs');
    self.socket = new SocketJS(url);

    self.watchObject = new WatchObject();

    self.stompClientProxied = Stomp.over(self.socket);

    self.stompClient = self.watchObject.proxy(self.stompClientProxied);
    self.stompClient.reconnect_delay = 5000;
    self.stompClient.connect({},function(data){
      func(self.stompClient, data);
    });

  }
  executeWhenConnected(func){
    var selfWrap = this;
    if(selfWrap.client().connected){
      func();
      return;
    }
    selfWrap.watcher().watch(self, selfWrap.client(), "connected", "set", function(object, key, oldValue, newValue) {
      object[key] = newValue;
      return object.connected;
    }, function(parent, object, key, oldValue, newValue, id, keys) {
      if (selfWrap.watcher().remove(object, keys, 'set', id)) {
        console.log("=========== removed observe on " + keys + " for object with id: " + object._uniqueIdentifier);
      }
      func();
    });
  }
  subscribe(target, session, func){
    this.subscriptions[target]=this.client().subscribe(target+session, func);
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
