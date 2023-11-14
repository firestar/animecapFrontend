/**
 * Created by Nathaniel on 4/9/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { GroupService } from '../database/group.service';
import {EpisodeService} from '../database/episode.service';
import {EnvironmentService} from '../database/env.service';

@Component({
    selector: 'grouplist',
    templateUrl: 'grouplisting.component.html',
    styleUrls:['grouplisting.component.css']
})
export class GroupListing {
  constructor(public envService:EnvironmentService, private account: AccountService, private router: Router, private group: GroupService, private episodeService: EpisodeService){}
  groups = null;
  groupsData = {};
  name = "test";
  users = {};
  accountService = null;
  groupService = null;
  new(){
    let self = this;
    self.group.join(self.account.sessionKey(), self.name);
  }
  join(name){
    let self = this;
    self.group.join(self.account.sessionKey(), name );
  }
  ngOnInit(){
    let self = this;

    self.group.groupListFunction = async function(data){
      self.groups = Object.keys(data);
      self.groupsData = data;
      for (let groupsDataKey in self.groupsData) {
        if(self.groupsData[groupsDataKey].episode)
        self.groupsData[groupsDataKey].info = await self.episodeService.infoAsync(self.account.sessionKey(), self.groupsData[groupsDataKey].episode.key);
      }

     console.log(self.groupsData);
    }
    self.group.joinFunction = function (data) {
      self.router.navigate(['/group']);
    };
    self.group.client().executeWhenConnected(function () {
      self.groupService = self.group;
      self.group.listen(self.account.sessionKey());
      self.group.listing(self.account.sessionKey());
    });
  }
}
