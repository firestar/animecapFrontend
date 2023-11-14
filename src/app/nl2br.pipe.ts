/**
 * Created by Nathaniel on 4/6/2017.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'nl2br' })
export class NL2BR implements PipeTransform {
    transform(string:string):string {
        return string.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + "<br/>" + '$2');
    }
}