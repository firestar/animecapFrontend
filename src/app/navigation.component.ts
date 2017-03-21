/**
 * Created by Nathaniel on 3/15/2017.
 */

import { Component, Input } from '@angular/core';
import { AccountService } from './database/account.service';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html'
})
export class TopNavigationBar {
  constructor(private accountService: AccountService){}
  @Input() title: string;

}
