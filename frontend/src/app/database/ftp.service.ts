/**
 * Created by Nathaniel on 3/24/2017.
 */
import { Injectable } from '@angular/core';
import { AccountService } from '../database/account.service';
import {HttpFetch} from './http.fetch';

@Injectable()
export class FTPService extends HttpFetch {
  private showList = "/api/ftp/list";
  private showFiles = "/api/ftp/files";

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
}
