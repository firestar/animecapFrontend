/**
 * Created by Nathaniel on 3/20/2017.
 */
import {Component, Input, ElementRef} from '@angular/core';
import { ShowService } from '../database/show.service';
import { AccountService } from '../database/account.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import 'rxjs/Rx';
import { Group_WSService } from '../database/websocket/group.service';
import { ControlService} from '../database/control.service';

@Component({
  selector: 'watch',
  templateUrl: 'watch.component.html',
  styleUrls: ['watch.component.css']
})
export class WatchPage {
  constructor(private account: AccountService, private router: Router, private route: ActivatedRoute, private episodeService: EpisodeService, private element: ElementRef, private gws: Group_WSService, private control: ControlService){}
  episodeData = null;
  duration = 0;
  video = null;
  completePercent=97;
  rollToNextVideo=true;
  goBackToShowOnComplete=false;
  prev = null;
  videoSource;
  next = null;
  episodeId = null;
  seeked(){
    let self = this;
    this.video.play();
    if (self.control.slave) {
      self.control.info(self.account.sessionKey(), self.control.controller, self.video.currentTime, self.duration, self.next != null, self.prev != null, true, self.episodeId, false);
    }
  }
  buffering(){
    let self = this;
    if (self.control.slave) {
      self.control.info(self.account.sessionKey(), self.control.controller, self.video.currentTime, self.duration, self.next != null, self.prev != null, false, self.episodeId, true);
    }
  }
  paused(){
    let self = this;
    if (self.control.slave) {
      self.control.info(self.account.sessionKey(), self.control.controller, self.video.currentTime, self.duration, self.next != null, self.prev != null, false, self.episodeId, false);
      let repeat = function(){
        setTimeout(function () {
          if (self.video.paused) {
            self.control.info(self.account.sessionKey(), self.control.controller, self.video.currentTime, self.duration, self.next != null, self.prev != null, false, self.episodeId, false);
            repeat();
          }
        }, 1000);
      }
      repeat();
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
      self.episodeService.watching(self.account.sessionKey(), self.episodeData.episode.id, "" + time + "", function () {});
      if (self.control.slave) {
        self.control.info(self.account.sessionKey(), self.control.controller, time, self.duration, self.next != null, self.prev != null, true, self.episodeId, false);
      }
      self.sendNext=new Date().getTime()+1000;
    }
    if((time/self.duration)>(self.completePercent/100) && !self.control.slave && self.next && self.rollToNextVideo){
      self.showEpisode(self.next);
    }else if(self.goBackToShowOnComplete && !self.control.slave){
      self.router.navigate(['show', self.episodeData.show.id, self.episodeData.show.title.toLowerCase().split(' ').join('_')])
    }

  }
  playing(){
    let self = this;
    this.timeSend();
    console.log("playing");
    if(self.control.slave){
      self.control.info(self.account.sessionKey(), self.control.controller, self.video.currentTime, self.duration, self.next!=null, self.prev!=null, true, self.episodeId, false);
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
    self.account.executeWhenLoggedIn(function () {
      if(self.control.slave) {
        self.initControlSubscriptions();
      }
      self.rollToNextVideo = localStorage.getItem("goToNextVideoOnComplete")=="true";
      self.goBackToShowOnComplete = localStorage.getItem("goToShowPageOnComplete")=="true";
      self.completePercent = parseInt(localStorage.getItem("percentToComplete"));
      self.episodeService.info(self.account.sessionKey(), self.episodeId.toString(), function(data){
        self.episodeData = data;
        self.episodeData.show.episodes.sort(function (a, b) {
          return a.episode - b.episode;
        });
        for (i = 0; i < data.source.streams.length; i++) {
          if (data.source.streams[i].duration > 0) {
            self.duration = data.source.streams[i].duration;
          }
        }
        self.next = null;
        self.prev=null;
        for(var i=0;i<self.episodeData.show.episodes.length;i++){
          if(self.episodeData.show.episodes[i].id==self.episodeId){
            if(i-1>=0)
              self.prev = self.episodeData.show.episodes[i-1];
            if(i+1<self.episodeData.show.episodes.length)
              self.next = self.episodeData.show.episodes[i + 1];
            break;
          }
        }
        self.waitForVideo();
      });
    });
  }
  destroyControlSubscriptions(){
    let self = this;
    self.gws.unsubscribe('/listen/load');
    self.gws.unsubscribe('/listen/control');
    self.gws.unsubscribe('/listen/seek');

  }
  initControlSubscriptions(){
    let self = this;
    self.gws.subscribe('/listen/load', self.account.sessionKey(), function(data){
      let episode = JSON.parse(data.body);
      console.log(episode);
      self.router.navigate(['/watch',episode.id, episode.title, 'episode_'+episode.episodeNumber], {relativeTo: self.route, skipLocationChange: false});
      self.episodeData = null;
      self.episodeId = episode.id;
      self.waitForAccount();
    });
    self.gws.subscribe('/listen/seek', self.account.sessionKey(), function(data){
      let act = JSON.parse(data.body);
      self.video.currentTime = act.position;
    });
    self.gws.subscribe('/listen/control', self.account.sessionKey(), function(data){
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
    self.videoSource = localStorage.getItem("videoSource");
    self.route.params
      .map(params => params['episode'])
      .subscribe((id) => {
        self.episodeId = id;
      });
    self.waitForAccount();
  }
}
