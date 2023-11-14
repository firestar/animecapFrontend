/**
 * Created by Nathaniel on 3/31/2017.
 */
import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
class MyEmitter extends EventEmitter {}

@Injectable()
export class EventService{
  constructor () {}
  public emitter = new MyEmitter();
}
