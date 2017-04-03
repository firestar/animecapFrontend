/**
 * Created by Nathaniel on 4/2/2017.
 */
import { Injectable } from '@angular/core';


@Injectable()
export class ControlService{
  constructor () {}
  private controlled = {};
  private controlling = 0;
  public controller;
  public slave = false;
  private ws = null;

  setWS(ws){
    this.ws = ws;
  }
  add(session, mysession){
    this.controlled[session]=true;
    this.controlling++;
    this.remote(session, mysession);
  }
  remove(session, mysession){
    delete this.controlled[session];
    this.controlling--;
    this.release(session, mysession);
  }

  removeOld(instances){
    var self = this;
    var list = self.controlled;
    self.controlled = {};
    this.controlling=0;
    if(instances) {
      for (var i = 0; i < instances.length; i++) {
        if (list[instances[i][0]]) {
          self.controlled[instances[i][0]] = true;
          this.controlling++;
        }
      }
    }
  }
  remote(session, mysession){
    this.ws.client().send('/call/remote', {}, JSON.stringify({ target: session, session: mysession}));
  }
  load(episode, session){
    this.ws.client().send('/call/load', {}, JSON.stringify({ episode: episode,session: session, targets: this.controlled}));
  }
  release(target, mysession){
    this.ws.client().send('/call/release', {}, JSON.stringify({ session: mysession, target: target}));
  }
  info(mysession, controller, position, duration, hasNext, hasPrev, playing, episode, buffering){
    this.ws.client().send('/call/info', {}, JSON.stringify({
      session: mysession,
      controller: controller,
      position:position,
      duration:duration,
      hasNext:hasNext,
      hasPrev:hasPrev,
      playing:playing,
      episode:episode,
      buffering:buffering
    }));
  }
  action(mysession, action){
    this.ws.client().send('/call/control', {}, JSON.stringify({ session: mysession, targets: this.controlled, action: action}));
  }
  seek(mysession, position){
    this.ws.client().send('/call/seek', {}, JSON.stringify({ session: mysession, targets: this.controlled, position: position}));
  }
  is(){
    return this.controlling>0;
  }
  has(){
    return this.controlled;
  }
}
