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
  shows;
  ngOnInit(){
    let self = this;
    let waitForAccount = function() {
      console.log("waiting, show index");
      setTimeout(function () {
        if(self.account.checked) {
          self.showService.list(self.account.sessionKey, function (data) {
            for (var i = 0; i < data.length; i++) {
              data[i].episodes.sort(function (a, b) {
                return a.episode - b.episode;
              });
            }
            self.shows = data;
          });
        }else{
          waitForAccount();
        }
      }, 50);
    }
    waitForAccount();
  }
  build(){

  }
}
