/**
 * Created by Nathaniel on 3/27/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service'
import {EnvironmentService} from '../database/env.service';

@Component({
  selector: 'unfinished',
  templateUrl: 'unfinished.component.html'
})
export class UnfinishedEpisodes {
  constructor(public envService:EnvironmentService, private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService){}
  episodes = null;
  @Input() limit=50;
  @Input() noBread=false
  @Input() compressed = false;
  ngOnInit(){
    let self = this;
    self.account.executeWhenLoggedIn(function () {
      self.episodeService.unfinished(self.account.sessionKey(), function(data){
        self.episodes = data.slice(0,self.limit);
        self.episodes.sort((a,b)=>new Date(b.created).getTime()-new Date(a.created).getTime());
      });
    });
  }
}
