import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class EnvironmentService {
  private _api: string = environment.animecap_api;
  get api(): string {
    return this._api;
  }

  set api(value: string) {
    this._api = value;
  }
}
