import { TagService } from "../database/tag.service";
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service';
import { FavoriteService } from '../database/favorite.service';
import {EnvironmentService} from '../database/env.service';


@Component({
  selector: 'tagedit',
  templateUrl: 'tagedit.component.html'
})
export class TagEditPage {
  constructor(public envService:EnvironmentService, private account: AccountService, private tag:TagService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService, private favoriteService: FavoriteService) {
  }
  accountData={};
  show = {id:""};
  tagName : string="";
  creating=true;
  accountFound(){
    var self = this;

    self.accountData = self.account.user();
    var session = self.account.sessionKey();
    let show = self.route.snapshot.params['show'];
    self.showService.info(session, show, function(data){
      if(data[0].tags) {
        data[0].tags.sort(function (a, b) {
          return a.name>b.name;
        });
      }
      self.show = data[0];
    });
  }
  create(){
    var self = this;
    var session = self.account.sessionKey();
    self.tag.create(session, self.tagName,function(data){
      self.add();
    });
  }
  add(){
    var self = this;
    var session = self.account.sessionKey();
    self.tag.add(session, self.show.id, self.tagName,function(data){
      self.updateShowInfo();
    });
  }

  updateShowInfo(){
    var self = this;
    var session = self.account.sessionKey();
    self.showService.info(session, self.show.id, function(data){
      if(data[0].tags) {
        data[0].tags.sort(function (a, b) {
          return a.name>b.name;
        });
      }
      self.show = data[0];
    });
  }
  remove(tagName:string){
    var self = this;
    var session = self.account.sessionKey();
    self.tag.remove(session, self.show.id, tagName,function(data){
      self.updateShowInfo();
    });
  }
  checkIfExists(){
    var self = this;
    var session = self.account.sessionKey();
    self.tag.get(session, self.tagName,function(data){
      console.log(data);
      if(data!=null){
        self.creating=false;
      }else{
        self.creating=true;
      }
    });
  }
  ngOnInit(){
    var self = this;
    self.account.executeWhenLoggedIn(function () {
      self.accountFound();
    });
  }
}
