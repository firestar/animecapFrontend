/**
 * Created by Nathaniel on 3/23/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AccountService } from '../database/account.service';

@Injectable()
export class FavoriteService {
  constructor(private http: Http) {}
  private showFavoriteAddFetch = "/show/favorite/add";
  private showFavoriteRemoveFetch = "/show/favorite/remove";

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
  fetchURLPost(url, data, func){
    return this.http.post(url, data, {}).subscribe((res:Response) =>  func(res.json()))
  }
}
