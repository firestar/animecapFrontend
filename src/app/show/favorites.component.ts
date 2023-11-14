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
  selector: 'favorites',
  templateUrl: 'favorites.component.html'
})
export class FavoriteShows {
  constructor(public envService:EnvironmentService, private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService){}
  shows = null;
  @Input() noBread = false;
  ngOnInit(){
    let self = this;
    self.account.executeWhenLoggedIn(function () {
      self.showService.favorites(self.account.sessionKey(), async (data) => {
        self.shows = data;
        for (let i = 0; i < self.shows.length; i++) {
          const episodes = await self.showService.episodesAsync(self.account.sessionKey(), self.shows[i].key);
          self.shows[i].data.episodes = episodes;
          self.shows[i].data.episodes?.sort(function (a, b) {
            return b.data.episode - a.data.episode;
          });
        }

      });
    });
  }
}
