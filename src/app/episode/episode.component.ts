/**
 * Created by Nathaniel on 3/20/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service'
import {CacheService} from 'ng2-cache/ng2-cache';

@Component({
  selector: 'episode',
  templateUrl: 'episode.component.html',
  styleUrls: ['episode.component.css'],
  providers: [ CacheService ]
})
export class EpisodeElement {
  constructor(private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService, private _cacheService: CacheService){}
  @Input() episode;
  duration = null;
  episodeData = null;
  ngOnInit(){
    let self = this;
    let waitForAccount = function() {
      console.log("waiting, watch");
      setTimeout(function () {
        if(self.account.checked) {
          if(!self._cacheService.exists('ep'+self.episode.toString())) {
            self.episodeService.info(self.account.sessionKey, self.episode.toString(), function (data) {
              var i = 0;
              for (i = 0; i < data.source.streams.length; i++) {
                if (data.source.streams[i].duration > 0) {
                  self.duration = data.source.streams[i].duration;
                }
              }
              self.episodeData = data;
              //self._cacheService.set('ep'+self.episode.toString(), data, {expires: Date.now() + 1000 * 60 * 2});
            });
          }else{
            self.episodeData = self._cacheService.get('ep'+self.episode.toString());
          }
        }else{
          waitForAccount();
        }
      }, 50);
    }
    waitForAccount();
  }
}
