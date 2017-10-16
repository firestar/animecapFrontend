/**
 * Created by Nathaniel on 3/27/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service'

@Component({
  selector: 'favorites',
  templateUrl: 'favorites.component.html'
})
export class FavoriteShows {
  constructor(private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService){}
  shows = null;
  @Input() noBread = false;
  ngOnInit(){
    let self = this;
    self.account.executeWhenLoggedIn(function () {
      self.showService.favorites(self.account.sessionKey(), function(data){
        self.shows = data;
      });
    });
  }
}
