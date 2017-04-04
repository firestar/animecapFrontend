/**
 * Created by Nathaniel on 3/25/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service'

@Component({
  selector: 'latest',
  templateUrl: 'latest.component.html'
})
export class LatestEpisodes {
  constructor(private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService){}
  episodes = null;
  @Input() noBread = false;
  @Input() limit=25;
  ngOnInit(){
    let self = this;
    let waitForAccount = function() {
      console.log("waiting, watch");
      setTimeout(function () {
        if(self.account.checked) {
          self.episodeService.latest(self.account.sessionKey, function(data){
            self.episodes = data.slice(0,self.limit);
          });
        }else{
          waitForAccount();
        }
      }, 50);
    }
    waitForAccount();
  }
}
