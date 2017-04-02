/**
 * Created by Nathaniel on 4/2/2017.
 */
import { Injectable } from '@angular/core';


@Injectable()
export class ControlService{
  constructor () {}
  private controlled = {};
  private controlling = 0;
  public slave = false;
  private ws = null;

  setWS(ws){
    this.ws = ws;
  }
  add(session, mysession){
    this.controlled[session]=true;
    this.controlling++;
    this.ws.client().send('/call/remote', {}, JSON.stringify({ target: session, session: mysession}));
  }
  remove(session){
    delete this.controlled[session];
    this.controlling--;
  }
  removeOld(instances){
    var self = this;
    var list = self.controlled;
    self.controlled = {};
    this.controlling=0;
    for(var i=0;i<instances.length;i++){
      if(list[instances[i][0]]){
        self.controlled[instances[i][0]]=true;
        this.controlling++;
      }
    }
  }
  load(episode, session){
    this.ws.client().send('/call/load', {}, JSON.stringify({ episode: episode,session: session, targets: this.controlled}));
  }
  is(){
    return this.controlling>0;
  }
  has(){
    return this.controlled;
  }
}
