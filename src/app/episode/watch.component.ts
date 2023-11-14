/**
 * Created by Nathaniel on 3/20/2017.
 */
import {Component, Input, ElementRef, ViewChild} from '@angular/core';
import {ShowService} from '../database/show.service';
import {AccountService} from '../database/account.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {EpisodeService} from '../database/episode.service';
import {Remote_WSService} from '../database/websocket/remote.service';
import {ControlService} from '../database/control.service';
import {firstValueFrom} from 'rxjs/internal/firstValueFrom';
import videojs from 'video.js';
import {EnvironmentService} from '../database/env.service';

@Component({
  selector: 'watch',
  templateUrl: 'watch.component.html',
  styleUrls: ['watch.component.css']
})
export class WatchPage {
  @ViewChild('videoWrapper') videoWrapper;
  constructor(public envService:EnvironmentService, private account: AccountService, private showService: ShowService, private router: Router, private route: ActivatedRoute, private episodeService: EpisodeService, private element: ElementRef, private rws: Remote_WSService, private control: ControlService) {
  }

  episodeData = null;
  episodesData;
  sourceData;
  showData;
  player;
  sources = {
    md: null,
    sd: null,
    webm: null
  }
  video = ()=>this?.element?.nativeElement?.querySelector('video');
  completePercent = 97;
  rollToNextVideo = true;
  firstRun = true;
  goBackToShowOnComplete = false;
  prev = null;
  subtitle;
  chapters:boolean = false;
  videoSource;
  next = null;
  episodeId = null;
  wr;

  seeked() {
    let self = this;
    this.video().play();
    if (self.control.slave) {
      self.control.info(self.account.sessionKey(), self.control.controller, self.video().currentTime, self.video().duration, self.next != null, self.prev != null, true, self.episodeId, false);
    }
  }

  buffering() {
    let self = this;
    if (self.control.slave) {
      self.control.info(self.account.sessionKey(), self.control.controller, self.video().currentTime, self.video().duration, self.next != null, self.prev != null, false, self.episodeId, true);
    }
  }

  paused() {
    let self = this;
    if (self.control.slave) {
      self.control.info(self.account.sessionKey(), self.control.controller, self.video().currentTime, self.video().duration, self.next != null, self.prev != null, false, self.episodeId, false);
      let repeat = function () {
        setTimeout(function () {
          if (self.video().paused) {
            self.control.info(self.account.sessionKey(), self.control.controller, self.video().currentTime, self.video().duration, self.next != null, self.prev != null, false, self.episodeId, false);
            repeat();
          }
        }, 1000);
      }
      repeat();
    }
  }

  fullscreen() {
    var videoWrapper = document.getElementById('videoWrapper');
    console.log(document.fullscreenEnabled);
    if (videoWrapper.requestFullscreen) {
      videoWrapper.requestFullscreen();
    }
  }

  sendNext = 0;

  timeSend() {
    let self = this;
    if(!self.video())
      return;
    let time = self.video().currentTime;
    if (self.sendNext == 0 || self.sendNext < new Date().getTime()) {
      self.episodeService.watching(self.account.sessionKey(), self.episodeData.key, '' + time + '', function () {
      });
      if (self.control.slave) {
        self.control.info(self.account.sessionKey(), self.control.controller, time, self.video().duration, self.next != null, self.prev != null, true, self.episodeId, false);
      }
      self.sendNext = new Date().getTime() + 1000;
    }
    if ((time / self.video().duration) > (self.completePercent / 100) && !self.control.slave && self.next && self.rollToNextVideo) {
      self.showEpisode(self.next);
    } else if (self.goBackToShowOnComplete && !self.control.slave) {
      self.router.navigate(['show', self.showData.key, self.showData.data.title.toLowerCase().split(' ').join('_')])
    }

  }

  playing() {
    let self = this;
    this.timeSend();
    console.log('playing');
    if (self.control.slave) {
      self.control.info(self.account.sessionKey(), self.control.controller, self.video().currentTime, self.video().duration, self.next != null, self.prev != null, true, self.episodeId, false);
    }
  }

  showEpisode(episode) {
    let self = this;
    this.router.navigate(['/watch', episode.key, self.showData.data.title.toLowerCase().split(' ').join('_'), 'episode_' + episode.data.episode], {
      relativeTo: this.route,
      skipLocationChange: false
    });

    self.episodeData = null;
    self.episodeId = episode.key;
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
    self.chapters = false;
    self.firstRun = true;
    self.sources = {
      sd: null,
      webm: null,
      md: null
    }
    self.sourceData = null;
    self.subtitle = null;
    self.waitForAccount();
  }

  ngOnDestroy() {
    let self = this;

    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
    if (self.control.slave) {
      self.destroyControlSubscriptions();
    }
  }

  waitForVideo() {
    let self = this;
    setTimeout(function () {
      console.log('waiting for video');
      if (self.video() != null && self.episodeData != null) {
        if(!self.player) {
          let sources = [];
          if(self.sources?.webm && (self.videoSource=='webm' || self.videoSource=='any'))
            sources.push({src: `//{{envService.api}}/api/file/video/${self.sources.webm?.key}`,type:"video/mp4"});
          if(self.sources?.md && (self.videoSource=='md' || self.videoSource=='any'))
            sources.push({src: `//{{envService.api}}/api/file/video/${self.sources.md?.key}`,type:"video/mp4"});
          if(self.sources?.sd && (self.videoSource=='sd' || self.videoSource=='any'))
            sources.push({src: `//{{envService.api}}/api/file/video/${self.sources.sd?.key}`,type:"video/mp4"});
          const tracks = [];
          if(self.chapters)
            tracks.push({
              src:`//{{envService.api}}/api/file/video/chapters/${self.sourceData.key}`,
              kind:"chapters"
            })
          if(self.subtitle)
            tracks.push({
              label:"English",
              kind:"subtitles",
              srclang:"en",
              src:`//{{envService.api}}/api/file/video/subtitle/${self.sourceData.key}_${self.subtitle?.index}`,
              default: true,
            });
          self.firstRun = true;
          self.video().addEventListener("seeked",()=>self.seeked())
          self.video().addEventListener("stalled",()=>self.buffering())
          self.video().addEventListener("pause",()=>self.paused())
          self.video().addEventListener("timeupdate",()=>self.timeSend())
          self.video().addEventListener("play",()=>self.playing())
          self.video().addEventListener("loadstart", () => {
            if(!self.firstRun)
              return;
            self.firstRun = false;
            if (self.wr != null) {
              self.video().currentTime = parseFloat(self.wr.watchingConn?.metadata?.progress)
            } else {
              self.video().play();
            }
          });
          self.player = videojs(self.video(), {
            aspectRatio: "16:9",
            sources,
            autoplay:true,
            tracks,
            restoreEl: true
          }, () => {

          });
        }else{
          let sourceList = [];
          if(self.sources?.webm && (self.videoSource=='webm' || self.videoSource=='any'))
            sourceList.push({src: `//{{envService.api}}/api/file/video/${self.sources.webm?.key}`,type:"video/mp4"});
          if(self.sources?.md && (self.videoSource=='md' || self.videoSource=='any'))
            sourceList.push({src: `//{{envService.api}}/api/file/video/${self.sources.md?.key}`,type:"video/mp4"});
          if(self.sources?.sd && (self.videoSource=='sd' || self.videoSource=='any'))
            sourceList.push({src: `//{{envService.api}}/api/file/video/${self.sources.sd?.key}`,type:"video/mp4"});
          self.player.src = sourceList;
          console.log(sourceList)
          if(self.chapters)
            self.player.addRemoteTextTrack({
              src:`//{{envService.api}}/api/file/video/chapters/${self.sourceData.key}`,
              kind:"chapters"
            })
          if(self.subtitle)
            self.player.addRemoteTextTrack({
              label:"English",
              kind:"subtitles",
              srclang:"en",
              src:`//{{envService.api}}/api/file/video/subtitle/${self.sourceData.key}_${self.subtitle?.index}`,
              default: true,
            });
        }
        if (self.video().seekable && self.episodeData != null) {

        } else {
          self.waitForVideo();
        }
      } else {
        self.waitForVideo();
      }
    }, 400);
  }

  waitForAccount() {
    let self = this;
    self.account.executeWhenLoggedIn(function () {
      console.log('loading')
      if (self.control.slave) {
        self.initControlSubscriptions();
      }
      self.rollToNextVideo = localStorage.getItem('goToNextVideoOnComplete') == 'true';
      self.goBackToShowOnComplete = localStorage.getItem('goToShowPageOnComplete') == 'true';
      self.completePercent = parseInt(localStorage.getItem('percentToComplete'));
      self.episodeService.info(self.account.sessionKey(), self.episodeId, (data) => {

        self.wr = data.wr;
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
        if(data.source?.data?.chapters?.length>0){
          self.chapters = true;
        }
        self.subtitle = data.source?.data?.streams?.filter(stream => stream.codec_type == 'SUBTITLE')?.[0];
        self.episodeData = data.episode;

        self.showService.episodes(self.account.sessionKey(), data.show.key, (data) => {
          self.episodesData = data;
          self.episodesData?.sort(function (a, b) {
            return a.data.episode - b.data.episode;
          });
          for (var i = 0; i < self.episodesData?.length; i++) {
            if (self.episodesData?.[i].key == self.episodeId) {
              if (i - 1 >= 0) {
                self.prev = self.episodesData[i - 1];
              }
              if (i + 1 < self.episodesData.length) {
                self.next = self.episodesData[i + 1];
              }
              break;
            }
          }
        })

        self.next = null;
        self.prev = null;

        self.waitForVideo();
      });
    });
  }

  destroyControlSubscriptions() {
    let self = this;
    self.rws.unsubscribe('/listen/load');
    self.rws.unsubscribe('/listen/control');
    self.rws.unsubscribe('/listen/seek');

  }

  initControlSubscriptions() {
    let self = this;
    self.rws.subscribe('/listen/load', self.account.sessionKey(), function (data) {
      let episode = JSON.parse(data.body);
      self.router.navigate(['/watch', episode.id, episode.title, 'episode_' + episode.episodeNumber], {
        relativeTo: self.route,
        skipLocationChange: false
      });
      self.episodeData = null;
      self.showData = null;
      self.chapters = false;
      self.firstRun = true;
      self.sources = {
        sd: null,
        webm: null,
        md: null
      }
      self.sourceData = null;
      self.subtitle = null;
      self.episodeId = episode.id;
      if (self.player) {
        self.player.dispose();
        self.player = null;
      }
      self.waitForAccount();
    });
    self.rws.subscribe('/listen/seek', self.account.sessionKey(), function (data) {
      let act = JSON.parse(data.body);
      self.video().currentTime = act.position;
    });
    self.rws.subscribe('/listen/control', self.account.sessionKey(), function (data) {
      let act = JSON.parse(data.body);
      switch (act.action) {
        case 'play':
          self.video().play();
          break;
        case 'pause':
          self.video().pause();
          break;
        case 'next':
          self.showEpisode(self.next);
          break;
        case 'prev':
          self.showEpisode(self.prev);
          break;
      }
    });
  }

  async ngOnInit() {
    let self = this;
    self.videoSource = localStorage.getItem('videoSource');
    self.episodeId = self.route.snapshot.params['episode'];
    self.waitForAccount();
  }
}
