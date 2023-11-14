/**
 * Created by Nathaniel on 4/10/2017.
 */
import {Component, Input, ElementRef} from '@angular/core';
import {AccountService} from '../database/account.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {EpisodeService} from '../database/episode.service';
import {ShowService} from '../database/show.service'
import {GroupService} from '../database/group.service';
import {Group_WSService} from '../database/websocket/group.service';
import {EnvironmentService} from '../database/env.service';

@Component({
  selector: 'groupwatch',
  templateUrl: 'groupwatch.component.html',
  styleUrls: ['groupwatch.component.css']
})
export class GroupWatch {
  constructor(public envService:EnvironmentService, private account: AccountService, private element: ElementRef, private route: ActivatedRoute, private router: Router, private episodeService: EpisodeService, private gws: Group_WSService, private showService: ShowService, private group: GroupService) {
  }

  groupService = null;
  video = null;
  message = '';
  accountService = null;
  chatHeight = '0px';
  chatText = '0px';
  showChat = '0.6';
  instanceOfHide = 0;
  maxHeight;
  hiderTimeout = null;
  mousedOver = false;

  notificationQueue = new Array();
  notificationFader = 0;
  notificationText = '';

  visible() {
    let self = this;
    self.mousedOver = true;
    self.showChat = '0.60';
    self.instanceOfHide++;
  }

  hide() {
    let self = this;
    self.mousedOver = false;
    self.instanceOfHide++;
    let inst = self.instanceOfHide;
    clearTimeout(self.hiderTimeout);
    self.hiderTimeout = setTimeout(function () {
      //console.log(inst+":"+self.instanceOfHide);
      if (inst == self.instanceOfHide) {
        self.showChat = '0';
      }
    }, 100);
  }

  visibleTrigger() {
    let self = this;
    self.showChat = '0.60';
    if (self.mousedOver == false) {
      self.instanceOfHide++;
      let inst = self.instanceOfHide;
      clearTimeout(self.hiderTimeout);
      self.hiderTimeout = setTimeout(function () {
        if (inst == self.instanceOfHide) {
          self.showChat = '0';
        }
      }, 2000);
    }
  };

  videoSource = null;
  videoWebm = null;
  videoSD = null;
  videoMD = null;
  videoSubtitle = null;

  sendMessage() {
    let self = this;
    var messageToSend = self.message;
    self.message = '';
    self.group.sendChatMessage(self.account.sessionKey(), messageToSend);
  }

  seeked() {
    let self = this;
    const leaderSession = self.group?.groups?.[self.group?.groupid]?.leader?.[3];
    if (leaderSession == self.account.sessionKey()) {
      self.group.seek(self.accountService.sessionKey(), self.video.currentTime);
    }
  }

  changeVideo(data) {

    let self = this;

    self.videoSubtitle = `//${self.envService.api}/api/file/video/subtitle/`+self.sourceData.key+'_' + self.subtitle?.index;
    console.log(self.videoSubtitle)
    if (self.sources.webm && (self.videoSource == 'any' || self.videoSource == 'webm')) {
      self.videoWebm = `//${self.envService.api}/api/file/video/` + self.sources.webm?.key;
    }
    if (self.sources.sd && (self.videoSource == 'any' || self.videoSource == 'sd')) {
      self.videoSD = `//${self.envService.api}/api/file/video/` + self.sources.sd?.key;
    }
    if (self.sources.md && (self.videoSource == 'any' || self.videoSource == 'md')) {
      self.videoMD = `//${self.envService.api}/api/file/video/` + self.sources.md?.key;
    }
    self.video.load();
  }

  loaded() {
    let self = this;
    console.log('loaded');
    const leaderSession = self.group?.groups?.[self.group?.groupid]?.leader?.[3];
    if (leaderSession != self.account.sessionKey()) {
      self.video.play();
    } else {
      self.video.play();
    }
  }

  playing() {
    let self = this;
    self.group.playing = true;
    const leaderSession = self.group?.groups?.[self.group?.groupid]?.leader?.[3];
    if (leaderSession == self.account.sessionKey()) {
      self.group.play(self.accountService.sessionKey());
    }
  }

  paused() {
    let self = this;
    self.group.playing = false;
    const leaderSession = self.group?.groups?.[self.group?.groupid]?.leader?.[3];
    if (leaderSession == self.account.sessionKey()) {
      self.group.pause(self.accountService.sessionKey());
    }
  }

  ngOnDestroy() {
    let self = this;
    //window.removeEventListener("onresize");
    self.group.playing = false;
  }

  remainderNotifications() {
    let self = this;
    if (self.notificationQueue.length > 0) {
      self.notificationText = self.notificationQueue.pop();
      self.notificationFader = 1;
      setTimeout(function () {
        self.notificationText = '';
        self.notificationFader = 0;
        setTimeout(function () {
          self.remainderNotifications();
        }, 1000);
      }, (4000 / (self.notificationQueue.length + 1)));
    }
  }

  showNotification(message) {
    let self = this;
    if (self.notificationFader == 0 && self.notificationQueue.length == 0) {
      self.notificationText = message;
      self.notificationFader = 1;
      setTimeout(function () {
        self.notificationText = '';
        self.notificationFader = 0;
        setTimeout(function () {
          self.remainderNotifications();
        }, 1000);
      }, 3000);
    } else {
      self.notificationQueue.push(message);
    }
  }

  rollToNextVideo;
  goBackToShowOnComplete;
  completePercent;
  showData;
  sourceData;
  sources = {
    webm: null,
    md: null,
    sd: null
  }
  subtitle;
  ngOnInit() {
    let self = this;

    self.rollToNextVideo = localStorage.getItem('goToNextVideoOnComplete') == 'true';
    self.goBackToShowOnComplete = localStorage.getItem('goToShowPageOnComplete') == 'true';
    self.completePercent = parseInt(localStorage.getItem('percentToComplete'));
    self.videoSource = localStorage.getItem('videoSource');
    var height = 550;
    self.maxHeight = window.outerHeight + 'px';
    self.chatHeight = height + 'px';
    self.chatText = (height - 45) + 'px';
    self.account.executeWhenLoggedIn(function () {
      self.video = self.element.nativeElement.querySelector('video');
      self.groupService = self.group;
      console.log(self.group);
      if (self.group.currentEpisode != null) {
        self.episodeService.info(self.account.sessionKey(), self.group.currentEpisode.key, function (data) {
          self.showData = data.show;
          self.sourceData = data.source;
          if(data.webm?.[0] && data.webm?.[0]?.data?.streams?.length>0) {
            self.sources.webm = data.webm?.[0];
          }
          if(data.md?.[0] && data.md?.[0]?.data?.streams?.length>0) {
            self.sources.md = data.md?.[0];
          }
          if(data.sd?.[0] && data.sd?.[0]?.data?.streams?.length>0) {
            self.sources.sd = data.sd?.[0];
          }
          console.log(data.source)
          self.subtitle = data.source?.data?.streams?.filter(stream => stream.codec_type == 'SUBTITLE')?.[0];
          self.changeVideo(data);
        });
      }
      setTimeout(function () {
        if (document.getElementById('chatBox')) {
          document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
        }
      }, 220);
      self.accountService = self.account;
      self.group.notificationBar = function (message) {
        self.showNotification(message);
      };
      self.group.seekFunction = function (position) {
        self.video.currentTime = position;
      };
      self.group.updateFunction = function () {
        self.group.update(self.account.sessionKey(), self.video.currentTime);
      };
      self.group.playFunction = function () {
        const leaderSession = self.group?.groups?.[self.group?.groupid]?.leader?.[3];
        if (leaderSession != self.account.sessionKey()) {
          self.video.play();
        }
      };
      self.group.pauseFunction = function () {
        const leaderSession = self.group?.groups?.[self.group?.groupid]?.leader?.[3];
        if (leaderSession != self.account.sessionKey()) {
          self.video.pause();
        }
      };
      self.group.commandFunction = function (cmd) {
        if (cmd[0] == 'message') {
          self.visibleTrigger();
          setTimeout(function () {
            document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
          }, 220);
        }
      }
      self.group.episodeCommand = function (data) {
        console.log("episodeCommand")
        console.log(data)
        self.episodeService.info(self.account.sessionKey(), data.episode.key, function (data) {
          self.changeVideo(data);
        });
      };
      if (self.group.groupid == null) {
        self.router.navigate(['/group']);
      }
    });
  }
}
