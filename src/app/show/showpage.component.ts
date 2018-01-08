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
  page = 0;
  pages = 0;
  pagelist = [];

  limit = 12;
  originalEpisodes=[];
  addFavorite(){
    let self = this;
    let id = self.route.snapshot.params['show'];
    self.favoriteService.add(self.account.sessionKey(), id.toString(), function(data){
      self.favoriteData = data;
    });
  }
  removeFavorite(){
    let self = this;
    let id = self.route.snapshot.params['show'];
    self.favoriteService.remove(self.account.sessionKey(), id.toString(), function(data){
      self.favoriteData = data;
    });
  }
  changePage(page){
    let self = this;
    if(page<0){
      return;
    }
    if(page>=self.pages){
      return;
    }
    if(page==self.page){
      return;
    }
    self.page=page;
    localStorage.setItem("pageShow["+self.showData.id+"]", self.page.toString());
    var height = document.getElementById("episodelist").offsetHeight;
    document.getElementById("episodelist").style.height = height+"px";
    self.showData.episodes = self.originalEpisodes.slice(self.page*self.limit, (self.page*self.limit)+self.limit);
    setTimeout(function(){
      var height = document.getElementById("episodelist").scrollHeight;
      document.getElementById("episodelist").style.height = height+"px";
    },1200);

  }
  accountFound(){
    let self = this;
    self.accountData = self.account.user();
    let id = self.route.snapshot.params['show'];
    self.showService.info(self.account.sessionKey(), id.toString(), function(data){
      data[0].episodes.sort(function (a, b) {
        return a.episode - b.episode;
      });
      self.showData = data[0];
      if(self.showData.tags) {
        self.showData.tags.sort(function (a, b) {
          return a.name>b.name;
        });
      }
      self.showData.cover = self.showData.cover.replace(/http:/ig, "");
      self.originalEpisodes = self.showData.episodes;
      self.pages = Math.ceil(self.originalEpisodes.length/self.limit);
      var savedPage = localStorage.getItem("pageShow["+self.showData.id+"]");
      if(savedPage){
        self.page=parseInt(savedPage);
      }else {
        if(data[1]!=null) {
          for (var i = 0; i < data[0].episodes.length; i++) {
            if (data[0].episodes[i].id == data[1].id) {
              self.page = Math.floor(i / self.limit);
              localStorage.setItem("pageShow[" + self.showData.id + "]", self.page.toString());
            }
          }
        }
      }
      if(self.showData.episodes.length>self.limit){
        self.showData.episodes = self.originalEpisodes.slice(self.page*self.limit, (self.page*self.limit)+self.limit);
        for(var i=0;i<self.pages;i++){
          self.pagelist.push(i);
        }
      }
      self.showData.description = self.showData.description.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + "<br/>" + '$2');

      self.resumeData = data[1];

      self.favoriteData = data[2];
      /*var episodeList = "";
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
      }*/
    });
  }
  ngOnInit(){
    var self = this;
    self.account.executeWhenLoggedIn(function () {
      self.accountFound();
    });
  }
  favorite(){

  }
}
