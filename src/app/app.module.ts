import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {RouterModule, Routes}   from '@angular/router';
import { PushNotificationsModule } from 'angular2-notifications';
import { MaterialModule } from '@angular/material';

import { LoginForm } from './users/login/login.component';
import { RegisterForm } from './users/register/register.component';
import { TopNavigationBar } from './navigation.component';
import { ShowIndex } from './show/showindex.component';
import { LogoutSend } from './users/logoutsend.component';
import { FourOFour } from './fourofour.component';
import { WatchPage } from './episode/watch.component';
import { URIPipe } from './touri.pipe';
import { ShowPage } from './show/showpage.component';
import { EpisodeElement } from './episode/episode.component';
import { ShowCreate } from './show/showcreate.component';
import { LatestEpisodes } from './episode/latest.component';
import { ShowElement } from './show/show.component';
import { FavoriteShows } from './show/favorites.component';
import { UnseenEpisodes } from './episode/unseen.component';
import { UnfinishedEpisodes } from './episode/unfinished.component';
import { SlavePage } from './episode/slave.component';
import { HostPage } from './episode/host.component';
import { GroupRoute } from './group/group.component';
import { GroupListing } from './group/grouplisting.component';
import { GroupWatch } from './group/groupwatch.component';
import { SettingsPage } from './settings/settings.component';


import { LoginCheck } from './users/logincheck';

import { UserService } from './database/user.service';
import { AccountService } from './database/account.service';
import { ShowService } from './database/show.service';
import { EpisodeService } from './database/episode.service';
import { FavoriteService } from './database/favorite.service';
import { FTPService } from './database/ftp.service';
import { WSService } from './database/websocket/ws.service';
import { Remote_WSService } from './database/websocket/remote.service';
import { ControlService } from './database/control.service';
import { GroupService } from './database/group.service';
import { EventService} from "./database/event.service";

import { RoundPipe } from './touri.pipe';
import { NL2BR } from './nl2br.pipe';

const routes :Routes = [
  { path: '', redirectTo:"/show/list", pathMatch:"full" },
  {
    path: 'show',
    children:[
      { path:"list", component: ShowIndex, canActivate: [LoginCheck] }
    ]
  },
  { path: 'login', component: LoginForm },
  { path: 'watch/:episode/:show/:epstring', component: WatchPage },
  { path: 'show/:show/:showstring', component: ShowPage },
  { path: 'show/favorites', component: FavoriteShows },
  { path: 'slave', component: SlavePage },
  { path: 'host', component: HostPage },
  { path: 'settings', component: SettingsPage },
  { path: 'group', component: GroupRoute },
  { path: 'group/watch', component: GroupWatch },
  { path: 'group/listing', component: GroupListing },
  { path: 'favorite/unseen', component: UnseenEpisodes },
  { path: 'favorite/unfinished', component: UnfinishedEpisodes },
  { path: 'show/create', component: ShowCreate},
  { path: 'episode/list', component: LatestEpisodes },
  { path: 'logout', component: LogoutSend },
  { path: 'register', component: RegisterForm },
  { path: '**', component: FourOFour }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginForm,
    RegisterForm,
    TopNavigationBar,
    ShowIndex,
    LogoutSend,
    FourOFour,
    WatchPage,
    URIPipe,
    ShowPage,
    EpisodeElement,
    RoundPipe,
    ShowCreate,
    LatestEpisodes,
    ShowElement,
    FavoriteShows,
    UnseenEpisodes,
    UnfinishedEpisodes,
    SlavePage,
    HostPage,
    NL2BR,
    GroupRoute,
    GroupListing,
    GroupWatch,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    PushNotificationsModule
  ],
  providers: [
    UserService,
    LoginCheck,
    AccountService,
    ShowService,
    EpisodeService,
    FavoriteService,
    FTPService,
    WSService,
    ControlService,
    GroupService,
    Remote_WSService,
    EventService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
