/**
 * Created by Nathaniel on 4/13/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import { ActivatedRoute, Params} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service'
import {CacheService} from 'ng2-cache/ng2-cache';

@Component({
    selector: 'settings',
    templateUrl: 'settings.component.html',
    providers: [ CacheService ]
})
export class SettingsPage {
    constructor(private account: AccountService, private route: ActivatedRoute, private episodeService: EpisodeService, private showService: ShowService, private _cacheService: CacheService){}
    completePercent=97;
    goBackToShowOnComplete=false;
    videoSource="sd";
    rollToNextVideo=true;
    save(whatChanged){
        let self = this;
        switch(whatChanged){
            case "completePercent":
                localStorage.setItem("percentToComplete", self.completePercent.toString());
                break;
            case "goBackToShowOnComplete":
                localStorage.setItem("goToShowPageOnComplete", self.goBackToShowOnComplete.toString());
                break;
            case "rollToNextVideo":
                localStorage.setItem("goToNextVideoOnComplete", self.rollToNextVideo.toString());
                self.goBackToShowOnComplete=false;
                self.save("goBackToShowOnComplete");
                break;
            case "videoSource":
                localStorage.setItem("videoSource", self.videoSource);
                break;
        }
    }
    ngOnInit(){
        let self = this;
        self.account.executeWhenLoggedIn(function () {
            self.rollToNextVideo = localStorage.getItem("goToNextVideoOnComplete")=="true";
            self.goBackToShowOnComplete = localStorage.getItem("goToShowPageOnComplete")=="true";
            console.log(self);
            self.videoSource = localStorage.getItem("videoSource");
            self.completePercent = parseInt(localStorage.getItem("percentToComplete"));
        });
    }
}
