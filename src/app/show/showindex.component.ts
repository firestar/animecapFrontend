/**
 * Created by Nathaniel on 3/15/2017.
 */

import { Component, Input } from '@angular/core';
import { ShowService } from '../database/show.service';
import { AccountService } from '../database/account.service';
import {EpisodeService} from '../database/episode.service';
import {EnvironmentService} from '../database/env.service';

@Component({
  selector: 'showindex',
  templateUrl: 'showindex.component.html',
  styleUrls: ['showindex.component.css']
})
export class ShowIndex {
  constructor(public envService:EnvironmentService, private showService:ShowService, private account: AccountService, private episodeService: EpisodeService){}
  shows = [];
  sorted=JSON.parse(localStorage.getItem('defaultSort')) ?? ["episode","desc"];
  accountData = null;
  originalShows = [];
  filterTitle="";
  ngOnInit(){
    let self = this;
    self.account.executeWhenLoggedIn(function(){
      var filterTitleSaved = localStorage.getItem("filterTitle");
      if(filterTitleSaved){
        self.filterTitle = filterTitleSaved;
      }
      self.accountData = self.account.user();
      self.showService.list(self.account.sessionKey(), async (data) => {
        for (var i = 0; i < data.length; i++) {
          const episodes = await self.showService.episodesAsync(self.account.sessionKey(), data[i].key);
          data[i].data.episodes = episodes;
          data[i].data.episodes?.sort(function (a, b) {
            return b.data.episode - a.data.episode;
          });
        }

        self.shows = data;
        self.originalShows = data;

        self.sort();
        self.filter();
      });
    })
  }
  clearFilter(){
    let self=this;
    self.filterTitle="";
    self.filter();
  }
  filter(){
    let self=this;
    if(self.filterTitle){
      localStorage.setItem("filterTitle", self.filterTitle);
      self.shows = self.originalShows.filter(function(v){
        return v.data?.title?.match(new RegExp(self.filterTitle, 'gi'));
      });
    }else{
      self.shows = self.originalShows;
      localStorage.removeItem("filterTitle");
    }
  }
  sort(){
    let self = this;
    switch(self.sorted[0]){
      case "episode":
        if(self.sorted[1]=="desc"){
          self.sortByLastEpisode(true);
        }else{
          self.sortByLastEpisode();
        }
        break;
      case "title":
        if(self.sorted[1]=="desc"){
          self.sortByTitle(true);
        }else{
          self.sortByTitle();
        }
        break;
      case "total":
        if(self.sorted[1]=="desc"){
          self.sortByTotalEpisodes(true);
        }else{
          self.sortByTotalEpisodes();
        }
        break;
    }
  }
  sortByLastEpisode(order=false){
    let self = this;
    self.shows.sort(function (a, b) {
      if (a.data.episodes[a.data.episodes.length - 1] && b.data.episodes[b.data.episodes.length - 1]) {
        return new Date(a.data.episodes[a.data.episodes.length - 1].created).getTime() - new Date(b.data.episodes[b.data.episodes.length - 1].created).getTime();
      }
      return 0;
    })
    if(order){
      self.sorted=["episode","desc"];
    }else{
      self.shows.reverse();
      self.sorted=["episode","asc"];
    }
    localStorage.setItem('defaultSort', JSON.stringify(self.sorted));
  }
  sortByTotalEpisodes(order=false){
    let self = this;
    self.shows.sort(function (a, b) {
      return a.data.episodes.length - b.data.episodes.length;
    })
    if(order){
      self.shows.reverse();
      self.sorted=["total","desc"];
    }else{
      self.sorted=["total","asc"];
    }
    localStorage.setItem('defaultSort', JSON.stringify(self.sorted));
  }
  sortByTitle(order=false){
    let self = this;
    self.shows.sort(function (a, b) {
      return a.data.title.localeCompare(b.data.title);
    })
    if(order){
      self.shows.reverse();
      self.sorted=["title","desc"];
    }else{
      self.sorted=["title","asc"];
    }
    localStorage.setItem('defaultSort', JSON.stringify(self.sorted));
  }
  build(){

  }
}
