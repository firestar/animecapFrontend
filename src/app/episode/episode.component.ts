/**
 * Created by Nathaniel on 3/20/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service'
import {CacheService} from 'ng2-cache/ng2-cache';
import { ControlService} from '../database/control.service';

@Component({
  selector: 'episode',
  templateUrl: 'episode.component.html',
  styleUrls: ['episode.component.css'],
  providers: [ CacheService ]

})
export class EpisodeElement {
  constructor(private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService, private _cacheService: CacheService, private control: ControlService){}
  @Input() episode;
  @Input() includeShow = false;
  duration = null;
  @Input() episodeData = null;
  remote;
  ngOnInit(){
    let self = this;
    console.log(self.episodeData);
    let waitForAccount = function() {
      console.log("waiting, watch");
      if(self.account.checked) {
        self.remote=self.control;
        if(self.episodeData==null) {
          if (!self._cacheService.exists('ep' + self.episode.toString())) {
            self.episodeService.info(self.account.sessionKey, self.episode.toString(), function (data) {
              for (var i = 0; i < data.source.streams.length; i++) {
                if (data.source.streams[i].duration > 0) {
                  self.duration = data.source.streams[i].duration;
                }
              }
              self.episodeData = data;
              //self._cacheService.set('ep'+self.episode.toString(), data, {expires: Date.now() + 1000 * 60 * 2});
            });

          } else {
            self.episodeData = self._cacheService.get('ep' + self.episode.toString());
          }
        }else{
          if(self.episodeData.source) {
            for (var i = 0; i < self.episodeData.source.streams.length; i++) {
              if (self.episodeData.source.streams[i].duration > 0) {
                self.duration = self.episodeData.source.streams[i].duration;
              }
            }
          }
        }
      }else{
        setTimeout(function () {
        waitForAccount();
        }, 50);
      }
    }
    waitForAccount();
  }
  load(episode){
    this.control.load(episode, this.account.sessionKey);
  }
}
