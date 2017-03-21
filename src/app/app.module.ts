import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {RouterModule, Routes}   from '@angular/router';

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

import { LoginCheck } from './users/logincheck';

import { UserService } from './database/user.service';
import { AccountService } from './database/account.service';
import { ShowService } from './database/show.service';
import { EpisodeService } from './database/episode.service';

import { MetaConfig, MetaService, MetaModule } from 'ng2-meta';


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
    EpisodeElement
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MetaModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [UserService, LoginCheck, AccountService, ShowService, EpisodeService, MetaService],
  bootstrap: [AppComponent]
})
export class AppModule {}
