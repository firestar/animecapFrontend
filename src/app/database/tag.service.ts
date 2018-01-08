/**
 * Created by Nathaniel on 1/06/2018.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class TagService {
  constructor(private http: Http) {}
  private getTag = "//animecap.com/api/tag/get";
  private addTag = "//animecap.com/api/tag/add";
  private removeTag = "//animecap.com/api/tag/remove";
  private createTag = "//animecap.com/api/tag/create";
  private deleteTag = "//animecap.com/api/tag/delete";

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
  fetchURLPost(url, data, func){
    return this.http.post(url, data, {}).subscribe((res:Response) =>
      ((res.text()!="" && res.text()!=null)?
        func(res.json())
      :
        func(null)
      )
    );
  }
}
