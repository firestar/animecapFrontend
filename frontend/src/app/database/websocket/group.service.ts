/**
 * Created by Nathaniel on 3/31/2017.
 */
import { Injectable } from '@angular/core';
import { WatchObject } from 'watchobject';
import {Client} from '@stomp/stompjs';

@Injectable()
export class Group_WSService{
  constructor () {}
  private socket;
  private _connected: boolean = false;
  private watchObject;
  private stompClient = null;
  private stompClientProxied = null;
  private subscriptions = {};
  initialize(url:string, func){
    var self = this;
    var SocketJS = require('sockjs-client');
    self.socket = new SocketJS(url);

    self.watchObject = new WatchObject();

    self.stompClientProxied = new Client({
      webSocketFactory: ()=>{
        return self.socket;
      },
      onConnect: (frame)=>{
        func(self.stompClient, frame);
        //self.executeWhenConnected(()=>{});
        self._connected = true;
      },
      onDisconnect: ()=>{
        self._connected = false;
      }
    });

    self.stompClientProxied.reconnect_delay = 5000;
    self.stompClientProxied.activate();
  }
  executeWhenConnected(func){
    var selfWrap = this;
    if(selfWrap.stompClientProxied.connected){
      func();
      return;
    }
  }
  public send(destination: string, options: {}, body: string){
    this.client().publish({
      destination,
      body
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
    return this.stompClientProxied;
  }
  get connected(): boolean {
    return this._connected;
  }
}

