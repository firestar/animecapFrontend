/**
 * Created by Nathaniel on 3/20/2017.
 */
import { Injectable } from '@angular/core';
import {HttpFetch} from './http.fetch';


@Injectable()
export class EpisodeService extends HttpFetch{
  private episodeFetch = "/api/episode/info";
  private episodeProgress = "/api/episode/watching";
  private episodeLatest = "/api/episode/latest";
  private episodeUnseen = "/api/episode/unseen";
  private episodeUnfinished = "/api/episode/unfinished";

  info(session:string, episode:string, func){
    this.fetchURLPost( this.episodeFetch, { session: session, objects: { episode: episode } }, function(body){
      func( body );
    });
  }
  async infoAsync(session:string, episode:string){
    return new Promise((resolve, reject) => {
      this.fetchURLPost(this.episodeFetch, {session: session, objects: {episode: episode}}, function (body) {
        resolve(body);
      });
    });
  }
  infoAndIgnore(session:string, episode:string, ignore:string, func){
    this.fetchURLPost( this.episodeFetch, { session: session, objects: { episode: episode, ignore: ignore } }, function(body){
      func( body );
    });
  }
  watching(session:string, episode:string, progress, func){
    this.fetchURLPost( this.episodeProgress, { session: session, objects: { episode: episode, position:progress } }, function(body){
      func( body );
    });
  }
  latest(session:string, func){
    this.fetchURLPost( this.episodeLatest, { session: session }, function(body){
      func( body );
    });
  }
  unseen(session:string, func){
    this.fetchURLPost( this.episodeUnseen, { session: session }, function(body){
      func( body );
    });
  }
  unfinished(session:string, func) {
    this.fetchURLPost(this.episodeUnfinished, {session: session}, function (body) {
      func(body);
    });
  }
}
