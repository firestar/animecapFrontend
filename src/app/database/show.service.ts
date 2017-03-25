/**
 * Created by Nathaniel on 3/19/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AccountService } from '../database/account.service';

@Injectable()
export class ShowService {
  constructor(private http: Http) {}
  private showFetch = "http://api.animecap.com/show/list";
  private showInfoFetch = "http://api.animecap.com/show/info";
  private showCreateFetch = "http://api.animecap.com/show/create";

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
  fetchURLPost(url, data, func){
    return this.http.post(url, data, {}).subscribe((res:Response) =>  func(res.json()))
  }
}
