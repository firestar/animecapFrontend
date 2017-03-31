/**
 * Created by Nathaniel on 3/20/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class EpisodeService {
  constructor(private http: Http) {}
  private episodeFetch = "https://api.animecap.com/episode/info";
  private episodeProgress = "https://api.animecap.com/episode/watching";
  private episodeLatest = "https://api.animecap.com/episode/latest";
  private episodeUnseen = "https://api.animecap.com/episode/unseen";
  private episodeUnfinished = "https://api.animecap.com/episode/unfinished";

  info(session:string, episode:string, func){
    this.fetchURLPost( this.episodeFetch, { session: session, objects: { episode: episode } }, function(body){
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
  unfinished(session:string, func){
    this.fetchURLPost( this.episodeUnfinished, { session: session }, function(body){
      func( body );
    });
  }
  fetchURLPost(url, data, func){
    return this.http.post(url, data, {}).subscribe((res:Response) =>  func(res.json()))
  }
}
