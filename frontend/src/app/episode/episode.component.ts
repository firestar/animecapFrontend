/**
 * Created by Nathaniel on 3/20/2017.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import { AccountService } from '../database/account.service';
import { EpisodeService } from '../database/episode.service';
import { ControlService} from '../database/control.service';
import { GroupService } from '../database/group.service';
import {Router} from "@angular/router";
import {ShowService} from '../database/show.service';
import {EnvironmentService} from '../database/env.service';

@Component({
  selector: 'episode',
  templateUrl: 'episode.component.html',
  styleUrls: ['episode.component.css'],
  providers: [ ]

})
export class EpisodeElement {
  constructor(public envService:EnvironmentService, private account: AccountService, private showService: ShowService, private router: Router, private episodeService: EpisodeService, private control: ControlService, private group: GroupService){}
  @Input() episode;
  @Input() includeShow = false;
  duration = null;
  @Output() hasFinished = new EventEmitter<boolean>();
  @Output() hasStarted = new EventEmitter<boolean>();
  @Input() episodeData = null;
  @Input() compressed = false;

  showData;
  groupService;
  accountService;
  remote;
  progress;
  ngOnInit(){
    let self = this;
    self.groupService = self.group;
    self.accountService = self.account;
    self.account.executeWhenLoggedIn(function () {
      self.remote=self.control;
      if(self.showData==null) {
        self.showService.showByEpisode(self.account.sessionKey(), self.episode, function (data) {
          self.showData = data;
        });
      }
      if(self.episodeData==null) {
        self.episodeService.info(self.account.sessionKey(), self.episode, function (data) {
          self.episodeData = data;
          self.duration = self.episodeData?.source?.data?.format?.duration ?? null;
          self.progress = self.episodeData?.wr?.watchingConn?.metadata?.progress;
        });
      }else{
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
