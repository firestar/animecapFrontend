/**
 * Created by Nathaniel on 3/20/2017.
 */
import {Component, Input, ElementRef} from '@angular/core';
import { ShowService } from '../database/show.service';
import { AccountService } from '../database/account.service';
import {ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';

@Component({
  selector: 'watch',
  templateUrl: 'watch.component.html'
})
export class WatchPage {
  constructor(private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private element: ElementRef){}
  episodeData = null;
  video = null;
  seeked(){
    console.log("play ;)");
    this.video.play();
  }
  timeSend(){
    let self = this;
    let time = this.video.currentTime;
    self.episodeService.watching(self.account.sessionKey, self.episodeData.episode.id, "" + time + "", function(){});
  }
  playing(){
    this.timeSend();
    console.log("playing");
  }

  ngOnDestroy(){
    let self = this;
    self.video.src="";
  }
  ngOnInit(){
    let self = this;
    let waitForVideo = function(){
      setTimeout(function(){
        console.log("waiting for video");
        self.video = self.element.nativeElement.querySelector('video');
        if(self.video!=null) {
          if(self.video.seekable){
            if(self.episodeData.wr!=null){
              self.video.currentTime = self.episodeData.wr.progress
            }else{
              self.video.play();
            }
          }else {
            waitForVideo();
          }
        }else{
          waitForVideo();
        }
      },100);
    }
    waitForVideo();
    let waitForAccount = function() {
      console.log("waiting, watch");
      setTimeout(function () {
        if(self.account.checked) {
          let id = self.route.snapshot.params['episode'];
          self.episodeService.info(self.account.sessionKey, id.toString(), function(data){
            self.episodeData = data;
          });
        }else{
          waitForAccount();
        }
      }, 50);
    }
    waitForAccount();
  }
}
