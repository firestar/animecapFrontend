/**
 * Created by Nathaniel on 3/31/2017.
 */
import { Injectable } from '@angular/core';
import { WatchObject } from 'watchobject';

@Injectable()
export class Remote_WSService{
    constructor () {}
    private socket;
    private stompClient=null;
    private watchObject;
    private subscriptions = {};

    initialize(url:string, func){
        var self = this;
        var SocketJS = require('sockjs-client');
        var Stomp = require('stompjs');
        self.socket = new SocketJS(url);
        self.watchObject = new WatchObject();
        self.stompClient = self.watchObject.watch(self, Stomp.over(self.socket), "connected", "set", function(obect, key, oldValue, newValue){
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
}
