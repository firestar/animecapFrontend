/**
 * Created by Nathaniel on 3/20/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class EpisodeService {
  constructor(private http: Http) {}
  private episodeFetch = "http://api.animecap.com/episode/info";

  info(session:string, episode:string, func){
    this.fetchURLPost( this.episodeFetch, { session: session, objects: { episode: episode }  }, function(body){
      func( body );
    });
  }
  fetchURLPost(url, data, func){
    return this.http.post(url, data, {}).subscribe((res:Response) =>  func(res.json()))
  }
}
