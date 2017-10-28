/**
 * Created by Nathaniel on 4/2/2017.
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
  selector: 'slave',
  templateUrl: 'slave.component.html'
})
export class SlavePage {
    constructor(private account: AccountService, private router: Router, private route: ActivatedRoute, private episodeService: EpisodeService, private element: ElementRef, private gws: Group_WSService, private control: ControlService) {
    }
    ngOnInit(){
        let self = this;
        self.gws.executeWhenConnected(function () {
            self.account.executeWhenLoggedIn(function () {
                self.gws.subscribe('/listen/load', self.account.sessionKey(), function (data) {
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
        self.gws.executeWhenConnected(function () {
            self.gws.unsubscribe('/listen/load');
        });
    }
}
