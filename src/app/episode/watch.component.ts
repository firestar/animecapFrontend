/**
 * Created by Nathaniel on 3/20/2017.
 */
import {Component, Input, ElementRef} from '@angular/core';
import { ShowService } from '../database/show.service';
import { AccountService } from '../database/account.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import 'rxjs/Rx';

@Component({
  selector: 'watch',
  templateUrl: 'watch.component.html',
  styleUrls: ['watch.component.css']
})
export class WatchPage {
  constructor(private account: AccountService, private router: Router, private route: ActivatedRoute, private episodeService: EpisodeService, private element: ElementRef){}
  episodeData = null;
  duration = 0;
  video = null;
  prev = null;
  next = null;
  episodeId = null;
  seeked(){
    console.log("play ;)");
    this.video.play();
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
  timeSend(){
    let self = this;
    let time = this.video.currentTime;
    self.episodeService.watching(self.account.sessionKey, self.episodeData.episode.id, "" + time + "", function(){});
    if((time/self.duration)>0.97){
      self.showEpisode(self.next);
    }

  }
  playing(){
    this.timeSend();
    console.log("playing");
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
