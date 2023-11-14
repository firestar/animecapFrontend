/**
 * Created by Nathaniel on 3/25/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service'
import {EnvironmentService} from '../database/env.service';

@Component({
  selector: 'latest',
  templateUrl: 'latest.component.html'
})
export class LatestEpisodes {
  constructor(public envService:EnvironmentService, private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService){}
  episodes = null;
  @Input() noBread = false;
  @Input() compressed = false;
  @Input() limit=25;
  ngOnInit(){
    let self = this;
    self.account.executeWhenLoggedIn(function () {
      self.episodeService.latest(self.account.sessionKey(), function(data){
        self.episodes = data.slice(0, self.limit);
        self.episodes.sort((a,b)=>new Date(b.created).getTime()-new Date(a.created).getTime());
      });
    });
  }
}
