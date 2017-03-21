/**
 * Created by Nathaniel on 3/20/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service'

@Component({
  selector: 'episode',
  templateUrl: 'episode.component.html'
})
export class EpisodeElement {
  constructor(private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService){}
  @Input() episode;
  @Input() showData;
  episodeData = null;
  ngOnInit(){
    let self = this;
    let waitForAccount = function() {
      console.log("waiting, watch");
      setTimeout(function () {
        if(self.account.checked) {
          let id = self.episode.id;
          self.episodeService.info(self.account.sessionKey, id.toString(), function(data){
            self.episodeData = data;
            console.log(data);
          });
        }else{
          waitForAccount();
        }
      }, 50);
    }
    waitForAccount();
  }
}
