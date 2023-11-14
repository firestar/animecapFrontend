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
  selector: 'show',
  templateUrl: 'show.component.html',
  styleUrls: ['show.component.css'],
  providers: [ ],
})
export class ShowElement {
  constructor(public envService:EnvironmentService, private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService){}
  @Input() show;
  ngOnInit(){
    let self = this;
    /*let waitForAccount = function() {
      console.log("waiting, watch");
      if(self.account.checked()) {
        //account found
      }else{
        setTimeout(function () {
          waitForAccount();
        }, 50);
      }
    }
    waitForAccount();*/
  }
}
