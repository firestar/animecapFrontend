/**
 * Created by Nathaniel on 3/23/2017.
 */
import { Injectable } from '@angular/core';
import {HttpFetch} from './http.fetch';

@Injectable()
export class FavoriteService extends HttpFetch {
  private showFavoriteAddFetch = "/api/show/favorite/add";
  private showFavoriteRemoveFetch = "/api/show/favorite/remove";

  add(session:string, id, func){
    this.fetchURLPost( this.showFavoriteAddFetch, { session: session, objects:{ show:id} }, function(body){
      func( body );
    });
  }
  remove(session:string, id,  func){
    this.fetchURLPost( this.showFavoriteRemoveFetch, { session: session, objects: { show: id } }, function(body){
      func( body );
    });
  }
}
