/**
 * Created by Nathaniel on 3/15/2017.
 */

import { Component, Input } from '@angular/core';
import { ShowService } from '../database/show.service';
import { AccountService } from '../database/account.service';

@Component({
  selector: 'showindex',
  templateUrl: 'showindex.component.html',
  styleUrls: ['showindex.component.scss']
})
export class ShowIndex {
  constructor(private showService:ShowService, private account: AccountService){}
  shows = [];
  sorted=["episode","desc"];
  accountData = null;
  originalShows = [];
  filterTitle="";
  ngOnInit(){
    let self = this;
    var defaultSort = localStorage.getItem('defaultSort');
    if(defaultSort){
      self.sorted = JSON.parse(defaultSort);
    }
    let waitForAccount = function() {
      if(self.account.checked) {
        var filterTitleSaved = localStorage.getItem("filterTitle");
        if(filterTitleSaved){
          self.filterTitle = filterTitleSaved;
        }
        self.accountData = self.account.saved;
        self.showService.list(self.account.sessionKey, function (data) {
          for (var i = 0; i < data.length; i++) {
            data[i].episodes.sort(function (a, b) {
              return a.episode - b.episode;
            });
          }
          self.shows = data;
          self.originalShows = data;
          self.sort();
          self.filter();
        });
      }else{
        setTimeout(function () {
          waitForAccount();
        }, 50);
      }
    }
    waitForAccount();
  }
  clearFilter(){
    let self=this;
    self.filterTitle="";
    self.filter();
  }
  filter(){
    let self=this;
    if(self.filterTitle!=""){
      localStorage.setItem("filterTitle", self.filterTitle);
      self.shows = self.originalShows.filter(function(v){
        return v.title.match(new RegExp(self.filterTitle, 'gi'));
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
      var aC = a.episodes[a.episodes.length-1].added;
      var bC = b.episodes[b.episodes.length-1].added;
      //console.log(a.title+" "+aC+":"+b.title+" "+bC);
      if(aC < bC)
        return -1;
      if(aC > bC)
        return 1;
      return 0;
    })
    if(order){
      self.shows.reverse();
      self.sorted=["episode","desc"];
    }else{
      self.sorted=["episode","asc"];
    }
    localStorage.setItem('defaultSort', JSON.stringify(self.sorted));
  }
  sortByTotalEpisodes(order=false){
    let self = this;
    self.shows.sort(function (a, b) {
      if(a.episodes.length < b.episodes.length)
        return -1;
      if(a.episodes.length > b.episodes.length)
        return 1;
      return 0;
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
      if(a.title < b.title)
        return -1;
      if(a.title > b.title)
        return 1;
      return 0;
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
