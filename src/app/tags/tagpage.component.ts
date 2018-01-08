import { TagService } from "../database/tag.service";
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service';
import { FavoriteService } from '../database/favorite.service';


@Component({
  selector: 'tagpage',
  templateUrl: 'tagpage.component.html'
})
export class TagPage {
  constructor(private account: AccountService, private tag:TagService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService, private favoriteService: FavoriteService) {
  }
  tagName="";
  accountData = {};
  shows = [];
  accountFound(){
    var self = this;

    self.accountData = self.account.user();
    var session = self.account.sessionKey();
    let tagName = self.route.snapshot.params['tag'];
    self.tag.get(session, tagName,function(data){
      self.tagName = data[0];
      self.shows = data[1];
    });
  }
  ngOnInit(){
    var self = this;
    self.account.executeWhenLoggedIn(function () {
      self.accountFound();
    });
  }
}