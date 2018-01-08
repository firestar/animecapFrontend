/**
 * Created by Nathaniel on 3/20/2017.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
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
  @Output() hasFinished = new EventEmitter<boolean>();
  @Output() hasStarted = new EventEmitter<boolean>();
  @Input() episodeData = null;
  @Input() compressed = false;
  groupService;
  accountService;
  remote;
  ngOnInit(){
    let self = this;
    self.groupService = self.group;
    self.accountService = self.account;
    self.account.executeWhenLoggedIn(function () {
      self.remote=self.control;
      if(self.episodeData==null) {
        if (!self._cacheService.exists('ep' + self.episode)) {
          self.episodeService.info(self.account.sessionKey(), self.episode, function (data) {
            self.duration = data.episode.runtime;
            self.episodeData = data;
            self._cacheService.set('ep'+self.episode, JSON.stringify([data, self.duration]), {expires: Date.now() + 1000*60});
          });

        } else {
          var data = JSON.parse(self._cacheService.get('ep' + self.episode));
          self.episodeData = data[0];
          self.duration = data[1];
          if(self.episodeData.wr!=null && self.duration!=null){
            self.hasStarted.emit(true);
            if((self.episodeData.wr.progress/self.duration)*100<90){
              self.hasFinished.emit(false);
            }else{
              self.hasFinished.emit(true);
            }
          }else{
            self.hasStarted.emit(false);
          }

        }
      }else{
        self.duration = self.episodeData.episode.runtime;
      }
    });
  }
  groupload(session, episode){
    this.group.load(session, episode);
    this.router.navigate(['/group']);
  }
  load(session, episode){
    this.control.load(episode, session);
  }
}
