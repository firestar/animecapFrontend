/**
 * Created by Nathaniel on 1/06/2018.
 */
import { Injectable } from '@angular/core';
import {HttpFetch} from './http.fetch';


@Injectable()
export class TagService extends HttpFetch {
  private getTag = "/api/tag/get";
  private addTag = "/api/tag/add";
  private removeTag = "/api/tag/remove";
  private createTag = "/api/tag/create";
  private deleteTag = "/api/tag/delete";

  get(session:string, tag:string, func){
    this.fetchURLPost( this.getTag, { session: session, objects: { tag: tag } }, function(body){
      func( body );
    });
  }
  create(session:string,  tag:string, func){
    this.fetchURLPost( this.createTag, { session: session, objects: { tag: tag } }, function(body){
      func( body );
    });
  }
  add(session:string, show:string, tag:string, func){
    this.fetchURLPost( this.addTag, { session: session, objects: { tag: tag, show: show } }, function(body){
      func( body );
    });
  }
  remove(session:string, show:string, tag:string, func){
    this.fetchURLPost( this.removeTag, { session: session, objects: { tag: tag, show: show } }, function(body){
      func( body );
    });
  }
  delete(session:string, tag:string, func){
    this.fetchURLPost( this.deleteTag, { session: session, objects: { tag: tag } }, function(body){
      func( body );
    });
  }
}
