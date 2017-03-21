/**
 * Created by Nathaniel on 3/20/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service'

@Component({
  selector: 'showpage',
  templateUrl: 'showpage.component.html',
  styleUrls: ['showpage.component.scss']
})
export class ShowPage {
  constructor(private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService){}
  showData = null;
  resumeData = null;
  ngOnInit(){
    let self = this;
    let waitForAccount = function() {
      console.log("waiting, watch");
      setTimeout(function () {
        if(self.account.checked) {
          let id = self.route.snapshot.params['show'];
          self.showService.info(self.account.sessionKey, id.toString(), function(data){
            data.episodes.sort(function (a, b) {
              return a.episode - b.episode;
            });
            self.showData = data;
          });
        }else{
          waitForAccount();
        }
      }, 50);
    }
    waitForAccount();
  }
  favorite(){
    alert("favoriting");
  }
}
