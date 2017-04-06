/**
 * Created by Nathaniel on 3/20/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service';
import { FavoriteService } from '../database/favorite.service';

@Component({
  selector: 'showpage',
  templateUrl: 'showpage.component.html',
  styleUrls: ['showpage.component.scss']
})
export class ShowPage {
  constructor(private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService, private favoriteService: FavoriteService){}
  showData = null;
  resumeData = null;
  favoriteData =0;
  episodesData;
  accountData;
  addFavorite(){
    let self = this;
    let id = self.route.snapshot.params['show'];
    self.favoriteService.add(self.account.sessionKey, id.toString(), function(data){
      self.favoriteData = data;
    });
  }
  removeFavorite(){
    let self = this;
    let id = self.route.snapshot.params['show'];
    self.favoriteService.remove(self.account.sessionKey, id.toString(), function(data){
      self.favoriteData = data;
    });
  }
  ngOnInit(){
    let self = this;
    let waitForAccount = function() {
      console.log("waiting, watch");
      setTimeout(function () {
        if(self.account.checked) {
          self.accountData = self.account.saved;
          let id = self.route.snapshot.params['show'];
          self.showService.info(self.account.sessionKey, id.toString(), function(data){
            data[0].episodes.sort(function (a, b) {
              return a.episode - b.episode;
            });
            self.showData = data[0];
            self.showData.description = self.showData.description.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + "<br/>" + '$2');
            self.resumeData = data[1];
            self.favoriteData = data[2];
            var episodeList = "";
            var i=0;
            for(i=0;i<data[0].episodes.length;i++){
              episodeList+=((episodeList=="")?"":"/")+data[0].episodes[i].id;
            }
            if(i==1) {
              self.episodesData = {};
              self.episodeService.infoAndIgnore(self.account.sessionKey, episodeList, "show/sd", function (data) {
                self.episodesData[parseInt(episodeList)] = data;
                  data.show=self.showData;
              });
            }else{
              self.episodeService.infoAndIgnore(self.account.sessionKey, episodeList, "show/sd", function (data) {
                var keys = Object.keys(data);
                for(var i=0;i<keys.length;i++){
                  data[keys[i]].show = self.showData;
                }
                self.episodesData = data;
              });
            }
          });
        }else{
          waitForAccount();
        }
      }, 50);
    }
    waitForAccount();
  }
  favorite(){

  }
}
