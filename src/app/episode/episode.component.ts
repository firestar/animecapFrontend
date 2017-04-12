/**
 * Created by Nathaniel on 3/20/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { EpisodeService } from '../database/episode.service';
import {CacheService} from 'ng2-cache/ng2-cache';
import { ControlService} from '../database/control.service';
import { GroupService } from '../database/group.service';
import {Router} from "@angular/router";

@Component({
  selector: 'episode',
  templateUrl: 'episode.component.html',
  styleUrls: ['episode.component.css'],
  providers: [ CacheService ]

})
export class EpisodeElement {
  constructor(private account: AccountService, private router: Router, private episodeService: EpisodeService, private _cacheService: CacheService, private control: ControlService, private group: GroupService){}
  @Input() episode;
  @Input() includeShow = false;
  duration = null;
  @Input() episodeData = null;
  @Input() compressed = false;
  groupService;
  accountService;
  remote;
  ngOnInit(){
    let self = this;
    self.groupService = self.group;
    self.accountService = self.account;
    console.log(self.episodeData);
    let waitForAccount = function() {
      console.log("waiting, watch");
      if(self.account.checked) {

        self.remote=self.control;
        if(self.episodeData==null) {
          if (!self._cacheService.exists('ep' + self.episode)) {
            self.episodeService.info(self.account.sessionKey, self.episode, function (data) {
              for (var i = 0; i < data.source.streams.length; i++) {
                if (data.source.streams[i].duration > 0) {
                  self.duration = data.source.streams[i].duration;
                }
              }
              self.episodeData = data;
              self._cacheService.set('ep'+self.episode, JSON.stringify([data, self.duration]), {expires: Date.now() + 1000*60});
            });

          } else {
            var data = JSON.parse(self._cacheService.get('ep' + self.episode));
            self.episodeData = data[0];
            self.duration = data[1];
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
  groupload(episode){
    this.group.load(this.account.sessionKey, episode);
    this.router.navigate(['/group']);
  }
  load(episode){
    this.control.load(episode, this.account.sessionKey);
  }
}
