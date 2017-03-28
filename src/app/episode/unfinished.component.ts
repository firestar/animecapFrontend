/**
 * Created by Nathaniel on 3/27/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service'

@Component({
  selector: 'unfinished',
  templateUrl: 'unfinished.component.html'
})
export class UnfinishedEpisodes {
  constructor(private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService){}
  episodes = null;
  ngOnInit(){
    let self = this;
    let waitForAccount = function() {
      console.log("waiting, watch");
      setTimeout(function () {
        if(self.account.checked) {
          self.episodeService.unfinished(self.account.sessionKey, function(data){
            self.episodes = data;
          });
        }else{
          waitForAccount();
        }
      }, 50);
    }
    waitForAccount();
  }
}
