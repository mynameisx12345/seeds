import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  private title = new BehaviorSubject('');
  title$ = this.title.asObservable();

  private pageTitle = new BehaviorSubject('');
  pageTitle$ = this.pageTitle.asObservable();

  constructor() { }

  setTitle(newTitle:string){
    this.title.next(newTitle);
  }

  setPageTitle(newTitle:string){
    this.pageTitle.next(newTitle);
  }
}
