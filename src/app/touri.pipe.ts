/**
 * Created by Nathaniel on 3/20/2017.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'uri' })
export class URIPipe implements PipeTransform {
  transform(string:string):string {
    return string.replace(/ /ig, "_");
  }
}
@Pipe({ name: 'round' })
export class RoundPipe implements PipeTransform {
  transform(ss) {
    return Math.round(ss);
  }
}
