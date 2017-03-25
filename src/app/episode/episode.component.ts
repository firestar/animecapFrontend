/**
 * Created by Nathaniel on 3/20/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service'
import { MetaService } from 'ng2-meta';

@Component({
  selector: 'episode',
  templateUrl: 'episode.component.html'
})
export class EpisodeElement {
  constructor(private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService){}
  @Input() episode;
  @Input() showData;
  duration = null;
  episodeData = null;
  ngOnInit(){
    let self = this;
    let waitForAccount = function() {
      console.log("waiting, watch");
      setTimeout(function () {
        if(self.account.checked) {
          let id = self.episode.id;
          self.episodeService.info(self.account.sessionKey, id.toString(), function(data){
            var i=0;
            for(i=0;i<data.sd[0].streams.length;i++) {
              if (data.sd[0].streams[i].codec_type == "VIDEO") {
                self.duration = data.sd[0].streams[i].duration;
              }
            }
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
