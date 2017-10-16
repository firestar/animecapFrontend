/**
 * Created by Nathaniel on 4/10/2017.
 */
import {Component, Input, ElementRef} from '@angular/core';
import { AccountService } from '../database/account.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { EpisodeService } from '../database/episode.service';
import { ShowService } from '../database/show.service'
import { GroupService } from '../database/group.service';
import { WSService } from '../database/ws.service';

@Component({
    selector: 'groupwatch',
    templateUrl: 'groupwatch.component.html',
    styleUrls:['groupwatch.component.css']
})
export class GroupWatch {
    constructor(private account: AccountService, private element: ElementRef, private route: ActivatedRoute, private router: Router, private episodeService: EpisodeService, private ws: WSService, private showService: ShowService, private group: GroupService){}
    groupService = null;
    video = null;
    message="";
    accountService=null;
    chatHeight = "0px";
    chatText = "0px";
    showChat = "0.6";
    instanceOfHide=0;
    maxHeight;
    hiderTimeout = null;
    mousedOver = false;

    notificationQueue = new Array();
    notificationFader=0;
    notificationText="";

    visible(){
        let self = this;
        self.mousedOver = true;
        self.showChat = "0.60";
        self.instanceOfHide++;
    }
    hide(){
        let self = this;
        self.mousedOver = false;
        self.instanceOfHide++;
        let inst = self.instanceOfHide;
        clearTimeout(self.hiderTimeout);
        self.hiderTimeout = setTimeout(function() {
            console.log(inst+":"+self.instanceOfHide);
            if (inst == self.instanceOfHide) {
                self.showChat = "0";
            }
        },100);
    }
    visibleTrigger() {
        let self = this;
        self.showChat = "0.60";
        if(self.mousedOver==false) {
            self.instanceOfHide++;
            let inst = self.instanceOfHide;
            clearTimeout(self.hiderTimeout);
            self.hiderTimeout = setTimeout(function () {
                if (inst == self.instanceOfHide) {
                    self.showChat = "0";
                }
            }, 2000);
        }
    };
    videoSource=null;
    videoSD=null;
    videoSubtitle=null;
    sendMessage(){
        let self = this;
        var messageToSend = self.message;
        self.message = '';
        self.group.sendChatMessage( self.account.sessionKey(), messageToSend);
    }
    seeked(){
        let self = this;
        self.video.currentTime;
    }
    changeVideo(data){
        let self = this;
        self.videoSubtitle = "http://animecap.com/subtitle/"+data.source.original+"/sub.vtt";
        if(self.videoSource=="any" || self.videoSource=="source") {
            self.videoSource = "http://vid.animecap.com/" + data.source.original + ".mp4";
        }
        if(self.videoSource=="any" || self.videoSource=="sd") {
            self.videoSD = "http://vid.animecap.com/" + data.sd[0].original + ".webm";
        }
        self.video.load();
    }
    loaded(){
        let self = this;
        console.log("loaded");
        if(self.group.leader==self.account.user().user) {
            self.video.play();
        }else{
            self.video.play();
        }
    }
    playing(){
        let self = this;
        self.group.playing=true;
        if(self.group.leader==self.account.user().user) {
            self.group.play(self.accountService.sessionKey());
        }
    }
    paused(){
        let self = this;
        self.group.playing=false;
        if(self.group.leader==self.account.user().user) {
            self.group.pause(self.accountService.sessionKey());
        }
    }
    ngOnDestroy(){
        let self = this;
        //window.removeEventListener("onresize");
        self.video.src="";
        self.group.playing = false;
    }
    remainderNotifications(){
        let self = this;
        if(self.notificationQueue.length>0) {
            self.notificationText = self.notificationQueue.pop();
            self.notificationFader = 1;
            setTimeout(function () {
                self.notificationText = "";
                self.notificationFader = 0;
                setTimeout(function () {
                    self.remainderNotifications();
                }, 1000);
            }, (4000 / (self.notificationQueue.length+1)));
        }
    }
    showNotification(message){
        let self = this;
        if(self.notificationFader==0 && self.notificationQueue.length==0) {
            self.notificationText = message;
            self.notificationFader = 1;
            setTimeout(function(){
                self.notificationText = "";
                self.notificationFader=0;
                setTimeout(function(){
                    self.remainderNotifications();
                },1000);
            },3000);
        }else{
            self.notificationQueue.push(message);
        }
    }
    rollToNextVideo;
    goBackToShowOnComplete;
    completePercent;
    ngOnInit(){
        let self = this;
        self.rollToNextVideo = localStorage.getItem("goToNextVideoOnComplete")=="true";
        self.goBackToShowOnComplete = localStorage.getItem("goToShowPageOnComplete")=="true";
        self.completePercent = parseInt(localStorage.getItem("percentToComplete"));
        self.videoSource = localStorage.getItem("videoSource");
        var height = 550;
        self.maxHeight = window.outerHeight+"px";
        self.chatHeight = height+"px";
        self.chatText = (height-45)+"px";
        self.account.executeWhenLoggedIn(function () {
            self.video = self.element.nativeElement.querySelector('video');
            self.groupService = self.group;
            if(self.group.currentEpisode!=null){
                self.episodeService.info(self.account.sessionKey(), self.group.currentEpisode.id, function (data) {
                    self.changeVideo(data);
                });
            }
            setTimeout(function () {
                if(document.getElementById("chatBox"))
                    document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight;
            },220);
            self.accountService = self.account;
            self.group.notificationBar = function(message){
                self.showNotification(message);
            };
            self.group.seekFunction = function(position){
                self.video.currentTime = position;
            };
            self.group.updateFunction = function(){
                self.group.update(self.account.sessionKey(), self.video.currentTime);
            };
            self.group.playFunction = function(){
                if(self.group.leader!=self.account.user().user) {
                    self.video.play();
                }
            };
            self.group.pauseFunction = function(){
                if(self.group.leader!=self.account.user().user) {
                    self.video.pause();
                }
            };
            self.group.commandFunction = function(cmd){
                if(cmd[0]=="message"){
                    self.visibleTrigger();
                    setTimeout(function () {
                        document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight;
                    },220);
                }
            }
            self.group.episodeCommand = function(data){
                self.episodeService.info(self.account.sessionKey(), data.id, function (data) {
                    self.changeVideo(data);
                });
            };
            if(self.group.groupid==null){
                self.router.navigate(['/group']);
            }
        });
    }
}