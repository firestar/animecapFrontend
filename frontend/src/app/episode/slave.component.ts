/**
 * Created by Nathaniel on 4/2/2017.
 */

import {Component, Input, ElementRef} from '@angular/core';
import { ShowService } from '../database/show.service';
import { AccountService } from '../database/account.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { Remote_WSService } from '../database/websocket/remote.service';
import { ControlService} from '../database/control.service';
import {EnvironmentService} from '../database/env.service';

@Component({
  selector: 'slave',
  templateUrl: 'slave.component.html'
})
export class SlavePage {
    constructor(public envService:EnvironmentService, private account: AccountService, private router: Router, private route: ActivatedRoute, private episodeService: EpisodeService, private element: ElementRef, private rws: Remote_WSService, private control: ControlService) {
    }
    ngOnInit(){
        let self = this;
        self.rws.executeWhenConnected(function () {
            self.account.executeWhenLoggedIn(function () {
                self.rws.subscribe('/listen/load', self.account.sessionKey(), function (data) {
                    let episode = JSON.parse(data.body);
                    console.log(episode);
                    self.router.navigate(['/watch', episode.id, episode.title, 'episode_' + episode.episodeNumber], {
                        relativeTo: self.route,
                        skipLocationChange: false
                    });
                });
            });
        });
    }
    ngOnDestroy(){
        let self = this;
        self.rws.executeWhenConnected(function () {
            self.rws.unsubscribe('/listen/load');
        });
    }
}
