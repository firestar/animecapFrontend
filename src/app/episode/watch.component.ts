/**
 * Created by Nathaniel on 3/20/2017.
 */
import { Component, Input } from '@angular/core';
import { ShowService } from '../database/show.service';
import { AccountService } from '../database/account.service';
import {ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';

@Component({
  selector: 'watch',
  templateUrl: 'watch.component.html'
})
export class WatchPage {
  constructor(private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService){}
  episodeData = null;
  ngOnInit(){
    let self = this;
    let waitForAccount = function() {
      console.log("waiting, watch");
      setTimeout(function () {
        if(self.account.checked) {
          let id = self.route.snapshot.params['episode'];
          self.episodeService.info(self.account.sessionKey, id.toString(), function(data){
            self.episodeData = data;
          });
        }else{
          waitForAccount();
        }
      }, 50);
    }
    waitForAccount();
  }
}
