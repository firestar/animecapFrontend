/**
 * Created by Nathaniel on 4/9/2017.
 */
import { Component, Input } from '@angular/core';
import { AccountService } from '../database/account.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service';
import { GroupService } from '../database/group.service';

@Component({
    selector: 'group',
    template: '<div class="loadingIcon"></div>'
})
export class GroupRoute {
    constructor(private account: AccountService, private router: Router, private group: GroupService){}
    shows = null;
    ngOnInit(){
        let self = this;
        self.account.executeWhenLoggedIn(function () {
            if(self.group.groupid!=null){
                self.router.navigate(['/group/watch']);
            }else{
                self.router.navigate(['/group/listing'])
            }
        });
    }
}
