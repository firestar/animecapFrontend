/**
 * Created by Nathaniel on 4/3/2017.
 */
import {Component, Input, ElementRef} from '@angular/core';
import { ShowService } from '../database/show.service';
import { AccountService } from '../database/account.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import 'rxjs/Rx';
import { WSService } from '../database/ws.service';
import { ControlService} from '../database/control.service';

@Component({
    selector: 'host',
    templateUrl: 'host.component.html'
})
export class HostPage {
    constructor(private account: AccountService, private router: Router, private route: ActivatedRoute, private element: ElementRef, private episodeService: EpisodeService,  private ws: WSService, private control: ControlService) {
    }
    session;
    remote;
    videoPosition;
    info={
        episode:null,
        position:null,
        playing:false
    };
    ngOnInit(){
        let self = this;
        self.session = self.account.sessionKey;
        self.remote = self.control;
        self.ws.subscribe('/listen/info', self.account.sessionKey, function(data){
            self.videoPosition = document.getElementById("videoPosition");
            let info = JSON.parse(data.body);
            self.info = info;
            if(self.videoPosition) {
                self.videoPosition.value=self.info.position;
            }
            // info status changed
        });

    }
    seek(){
        let self = this;
        self.control.seek(self.session, self.videoPosition.value);
    }
    ngOnDestroy(){
        let self = this;
        self.ws.unsubscribe('/listen/load');
    }
}