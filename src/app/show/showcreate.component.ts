/**
 * Created by Nathaniel on 3/24/2017.
 */
import { Component, Input } from '@angular/core';
import { ShowService } from '../database/show.service';
import { AccountService } from '../database/account.service';
import { Router } from "@angular/router";
import {FormControl} from '@angular/forms';
import {Observable} from "rxjs";
import { FTPService } from '../database/ftp.service';

@Component({
  selector: 'showcreate',
  templateUrl: 'showcreate.component.html'
})
export class ShowCreate {
  constructor(private showService:ShowService, private account: AccountService, private router: Router, private ftpService:FTPService){}
  accountData = null;
  allowed = false;
  workingpath = null;
  paths = null;
  subFolders = null;
  subFolder = null;
  files=null;
  finalpath = "";
  show={
    cover:null,
    title:null,
    description:null,
    path:null
  };
  options = [
    {
      title: "Ongoing",
      path: "/Anime/Series/Ongoing",
      by: "mod"
    },
    {
      title: "Complete",
      path: "/Anime/Series/Complete",
      by: "name"
    },
    {
      title: "Movies",
      path: "/Anime/Movies",
      by: "name"
    },
    {
      title: "OVAs",
      path: "/Anime/OVAs",
      by: "name"
    },
    {
      title: "Special",
      path: "/Anime/Specials",
      by: "name"
    },
    {
      title: "Web",
      path: "/Anime/Web/",
      by: "name"
    }
  ];
  grabListing(){
    let self = this;
    self.paths = null;
    self.files = null;
    self.show.path=null;
    console.log("working: ");
    console.log(self.workingpath);
    self.ftpService.list(self.account.sessionKey(), self.workingpath.path, self.workingpath.by, function(data){
      self.paths = data;
      console.log(data);
    });
  }
  grabFiles(){
    let self = this;
    self.files = null;
    self.finalpath = null;
    self.subFolders = null;
    self.subFolder=null;
    self.show.title = self.show.path;
    self.ftpService.files(self.account.sessionKey(), self.workingpath.path+"/"+self.show.path, function(data){
      console.log(data);
      for(var i=0;i<data.length;i++){
        if(/^([0-9]+)p$/i.test(data[i])) {
          self.finalpath = null;
          self.subFolders = data;
        }else{
          self.finalpath = self.workingpath.path + "/" + self.show.path;
          self.files = data;
        }
        break;
      }
    });
  }
  grabSubFiles(){
    let self = this;
    self.files = null;
    self.ftpService.files(self.account.sessionKey(), self.workingpath.path+"/"+self.show.path+"/"+self.subFolder, function(data){
      console.log(data);
      self.finalpath = self.workingpath.path + "/" + self.show.path+"/"+self.subFolder;
      self.files = data;
    });
  }
  save(){
    let self = this;
    let showData = self.show;
    showData.path=self.finalpath;
    self.showService.new(self.account.sessionKey(), showData, function(data){
      if(data.id!=""){
        self.router.navigate(["/"]);
      }
    });
  }
  ngOnInit(){
    let self = this;
    self.account.executeWhenLoggedIn(function () {
      self.accountData = self.account.user();
      if(self.accountData.level==2){
        self.allowed = true;
      }else{
        self.router.navigate(['/']);
      }
    });
  }
}
