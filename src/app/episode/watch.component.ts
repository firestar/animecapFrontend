/**
 * Created by Nathaniel on 3/20/2017.
 */
import {Component, Input, ElementRef} from '@angular/core';
import { ShowService } from '../database/show.service';
import { AccountService } from '../database/account.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import 'rxjs/Rx';
import { WSService } from '../database/ws.service';
import { ControlService} from '../database/control.service';

@Component({
  selector: 'watch',
  templateUrl: 'watch.component.html',
  styleUrls: ['watch.component.css']
})
export class WatchPage {
  constructor(private account: AccountService, private router: Router, private route: ActivatedRoute, private episodeService: EpisodeService, private element: ElementRef, private ws: WSService, private control: ControlService){}
  episodeData = null;
  duration = 0;
  video = null;
  prev = null;
  next = null;
  episodeId = null;
  seeked(){
    let self = this;
    this.video.play();
    if (self.control.slave) {
      self.control.info(self.account.sessionKey, self.control.controller, self.video.currentTime, self.duration, self.next != null, self.prev != null, true, self.episodeId, false);
    }
  }
  buffering(){
    let self = this;
    if (self.control.slave) {
      self.control.info(self.account.sessionKey, self.control.controller, self.video.currentTime, self.duration, self.next != null, self.prev != null, false, self.episodeId, true);
    }
  }
  paused(){
    let self = this;
    if (self.control.slave) {
      self.control.info(self.account.sessionKey, self.control.controller, self.video.currentTime, self.duration, self.next != null, self.prev != null, false, self.episodeId, false);
    }
  }
  fullscreen(){
    var videoWrapper = document.getElementById("videoWrapper");
    console.log(document.fullscreenEnabled);
    if (videoWrapper.requestFullscreen) {
      videoWrapper.requestFullscreen();
    } else if (videoWrapper.webkitRequestFullscreen) {
      videoWrapper.webkitRequestFullscreen();
    }
  }
  sendNext = 0;
  timeSend(){
    let self = this;
    let time = this.video.currentTime;
    if(self.sendNext==0 || self.sendNext<new Date().getTime()) {
      self.episodeService.watching(self.account.sessionKey, self.episodeData.episode.id, "" + time + "", function () {
      });
      if (self.control.slave) {
        self.control.info(self.account.sessionKey, self.control.controller, time, self.duration, self.next != null, self.prev != null, true, self.episodeId, false);
      }
      self.sendNext=new Date().getTime()+1000;
    }
    if((time/self.duration)>0.97 && !self.control.slave){
      self.showEpisode(self.next);
    }

  }
  playing(){
    let self = this;
    this.timeSend();
    console.log("playing");
    if(self.control.slave){
      self.control.info(self.account.sessionKey, self.control.controller, self.video.currentTime, self.duration, self.next!=null, self.prev!=null, true, self.episodeId, false);
    }
  }
  showEpisode(episode){
    let self = this;
    this.router.navigate(['/watch',episode.id,this.episodeData.show.title.toLowerCase().split(' ').join('_'),'episode_'+episode.episode], {relativeTo: this.route, skipLocationChange: false});
    self.episodeData = null;
    self.episodeId = episode.id;
    self.waitForAccount();
  }
  ngOnDestroy(){
    let self = this;
    self.video.src="";
    if(self.control.slave) {
      self.destroyControlSubscriptions();
    }
  }
  waitForVideo(){
    let self = this;
    setTimeout(function(){
      console.log("waiting for video");
      self.video = self.element.nativeElement.querySelector('video');
      if(self.video!=null) {
        if(self.video.seekable && self.episodeData!=null){
          if(self.episodeData.wr!=null){
            self.video.currentTime = self.episodeData.wr.progress
          }else{
            self.video.play();
          }
        }else {
          self.waitForVideo();
        }
      }else{
        self.waitForVideo();
      }
    },100);
  }
  waitForAccount() {
    let self = this;
    console.log("waiting, watch");
    setTimeout(function () {
      if(self.account.checked) {
        if(self.control.slave) {
          self.initControlSubscriptions();
        }
        self.episodeService.info(self.account.sessionKey, self.episodeId.toString(), function(data){
          self.episodeData = data;
          self.episodeData.show.episodes.sort(function (a, b) {
            return a.episode - b.episode;
          });
          for (i = 0; i < data.source.streams.length; i++) {
            if (data.source.streams[i].duration > 0) {
              self.duration = data.source.streams[i].duration;
            }
          }
          for(var i=0;i<self.episodeData.show.episodes.length;i++){
            if(self.episodeData.show.episodes[i].id==self.episodeId){
              if(i-1>=0)
                self.prev = self.episodeData.show.episodes[i-1];
              if(i+1<self.episodeData.show.episodes.length)
                self.next = self.episodeData.show.episodes[i+1];
              break;
            }
          }
          self.waitForVideo();
        });
      }else{
        self.waitForAccount();
      }
    }, 50);
  }
  destroyControlSubscriptions(){
    let self = this;
    self.ws.unsubscribe('/listen/load');
    self.ws.unsubscribe('/listen/control');
    self.ws.unsubscribe('/listen/seek');

  }
  initControlSubscriptions(){
    let self = this;
    self.ws.subscribe('/listen/load', self.account.sessionKey, function(data){
      let episode = JSON.parse(data.body);
      console.log(episode);
      self.router.navigate(['/watch',episode.id, episode.title, 'episode_'+episode.episodeNumber], {relativeTo: self.route, skipLocationChange: false});
      self.episodeData = null;
      self.episodeId = episode.id;
      self.waitForAccount();
    });
    self.ws.subscribe('/listen/seek', self.account.sessionKey, function(data){
      let act = JSON.parse(data.body);
      self.video.currentTime = act.position;
    });
    self.ws.subscribe('/listen/control', self.account.sessionKey, function(data){
      let act = JSON.parse(data.body);
      switch(act.action){
        case "play":
          self.video.play();
          break;
        case "pause":
          self.video.pause();
          break;
        case "next":
          self.showEpisode(self.next);
          break;
        case "prev":
          self.showEpisode(self.prev);
          break;
      }
    });
  }
  ngOnInit(){
    let self = this;
    self.route.params
      .map(params => params['episode'])
      .subscribe((id) => {
        self.episodeId = id;
      });
    self.waitForAccount();
  }
}
