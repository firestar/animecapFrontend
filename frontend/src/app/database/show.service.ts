/**
 * Created by Nathaniel on 3/19/2017.
 */
import { Injectable } from '@angular/core';
import {HttpFetch} from './http.fetch';

@Injectable()
export class ShowService extends HttpFetch{
  private showFetch = "/api/show/list";
  private showInfoFetch = "/api/show/info";

  private showEpisodesFetch = "/api/show/episodes";
  private showCreateFetch = "/api/show/create";
  private showFavoriteFetch = "/api/show/favorite";

  private showByEpisodeFetch = "/api/show/by/episode";

  list(session:string, func){
    this.fetchURLPost( this.showFetch, { session: session }, function(body){
      func( body );
    });
  }
  new(session:string, show,  func){
    show.session = session;
    this.fetchURLPost( this.showCreateFetch, show, function(body){
      func( body );
    });
  }
  info(session:string, id:string,  func){
    this.fetchURLPost( this.showInfoFetch, { session: session, objects: { show: id } }, function(body){
      func( body );
    });
  }
  episodes(session:string, id:string,  func){
    this.fetchURLPost( this.showEpisodesFetch, { session: session, objects: { show: id } }, function(body){
      func( body );
    });
  }
  async episodesAsync(session:string, id:string) : Promise<any>{
    return new Promise((resolve, reject) => {
      this.fetchURLPost( this.showEpisodesFetch, { session: session, objects: { show: id } }, function(body){
        resolve( body );
      });
    })
  }
  showByEpisode(session:string, episode:string,  func){
    this.fetchURLPost( this.showByEpisodeFetch, { session: session, objects: { episode } }, function(body){
      func( body );
    });
  }
  favorites(session:string,  func){
    this.fetchURLPost( this.showFavoriteFetch, { session: session }, function(body){
      func( body );
    });
  }
}
