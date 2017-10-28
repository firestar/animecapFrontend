/**
 * Created by Nathaniel on 4/3/2017.
 */
import {Component, Input, ElementRef} from '@angular/core';
import { ShowService } from '../database/show.service';
import { AccountService } from '../database/account.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import 'rxjs/Rx';
import { Group_WSService } from '../database/websocket/group.service';
import { ControlService} from '../database/control.service';

@Component({
    selector: 'host',
    templateUrl: 'host.component.html',
    styleUrls:['host.component.css']
})
export class HostPage {
    constructor(private account: AccountService, private router: Router, private route: ActivatedRoute, private element: ElementRef, private episodeService: EpisodeService,  private gws: Group_WSService, private control: ControlService) {
    }
    session;
    episodeId=0;
    episodeData=null;
    remote;
    videoPosition;
    info={
        episode:null,
        position:null,
        playing:false
    };
    ngOnInit(){
      let self = this;
      self.gws.executeWhenConnected(function () {
        self.account.executeWhenLoggedIn(function () {
          self.session = self.account.sessionKey();
          self.remote = self.control;
          self.gws.subscribe('/listen/info', self.session, function (data) {
            self.videoPosition = document.getElementById("videoPosition");
            let info = JSON.parse(data.body);
            self.info = info;
            if (self.episodeId != info.episode) {
              self.episodeId = info.episode;
              self.episodeService.info(self.session, String(self.episodeId), function (data) {
                self.episodeData = data;
              })
            }
            if (self.videoPosition) {
              self.videoPosition.value = self.info.position;
            }
            // info status changed
          });
        });
      });

    }
    seek(){
        let self = this;
        self.control.seek(self.session, self.videoPosition.value);
    }
    ngOnDestroy(){
        let self = this;
        self.gws.executeWhenConnected(function () {
          self.account.executeWhenLoggedIn(function () {
            self.gws.unsubscribe('/listen/load');
          });
        });
    }
}