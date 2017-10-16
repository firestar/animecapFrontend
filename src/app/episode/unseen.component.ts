/**
 * Created by Nathaniel on 3/27/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service'

@Component({
  selector: 'unseen',
  templateUrl: 'unseen.component.html'
})
export class UnseenEpisodes {
  constructor(private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService){}
  episodes = null;
  @Input() compressed = false;
  ngOnInit(){
    let self = this;
    self.account.executeWhenLoggedIn(function () {
      self.episodeService.unseen(self.account.sessionKey(), function(data){
        self.episodes = data;
      });
    });
  }
}
