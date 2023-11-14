/**
 * Created by Nathaniel on 3/31/2017.
 */
import {Injectable} from '@angular/core';
import {WatchObject} from 'watchobject';
import {Client} from '@stomp/stompjs';

(window as any).global = window;

@Injectable()
export class Remote_WSService {
  constructor() {
  }

  private socket;

  private _connected: boolean = false;
  private watchObject;
  public controller = null;
  private instances = [];
  private stompClientProxied = null;
  private subscriptions = {};

  initialize(url: string, func) {
    var self = this;
    var SocketJS = require('sockjs-client');
    self.socket = new SocketJS(url);
    self.watchObject = new WatchObject();

    self.stompClientProxied = new Client({
      webSocketFactory: () => {
        return self.socket;
      },
      onConnect: (frame) => {
        func(self.stompClientProxied, frame);
        self._connected = true;
      },
      onDisconnect: ()=>{
        self._connected = false;
      }
    });

    self.stompClientProxied.reconnect_delay = 5000;
    self.stompClientProxied.activate()
  }

  register(sessionKey: string) {
    var self = this;
    self.subscribe('/listen/listing', sessionKey, function (data) {
      self.instances = JSON.parse(data.body).instances;
      self.controller.removeOld(self.instances);
    });
  }

  executeWhenConnected(func) {
    var selfWrap = this;
    if (selfWrap._connected)
      return func();

  }

  subscribe(target, session, func) {
    this.subscriptions[target] = this.client().subscribe(target + '/' + session, func);
  }

  unsubscribe(target) {
    if (this.subscriptions[target]) {
      this.subscriptions[target].unsubscribe();
      delete this.subscriptions[target];
    }
  }

  client() {
    return this.stompClientProxied;
  }

  get connected(): boolean {
    return this._connected;
  }
}
