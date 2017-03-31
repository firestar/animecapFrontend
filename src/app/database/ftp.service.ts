/**
 * Created by Nathaniel on 3/24/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AccountService } from '../database/account.service';

@Injectable()
export class FTPService {
  constructor(private http: Http) {}
  private showList = "https://api.animecap.com/ftp/list";
  private showFiles = "https://api.animecap.com/ftp/files";

  list(session:string, path:string, by:string, func){
    this.fetchURLPost( this.showList, { session: session, objects: { path: path, by: by } }, function(body){
      func( body );
    });
  }
  files(session:string, path:string,  func){
    this.fetchURLPost( this.showFiles, { session: session, objects: { path: path} }, function(body){
      func( body );
    });
  }
  fetchURLPost(url, data, func){
    return this.http.post(url, data, {}).subscribe((res:Response) =>  func(res.json()))
  }
}
