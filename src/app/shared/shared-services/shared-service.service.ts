import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  private title = new BehaviorSubject('');
  title$ = this.title.asObservable();

  constructor() { }

  setTitle(newTitle:string){
    this.title.next(newTitle);
  }
}
