import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { UserI } from '../shared/models/shared-models';
import { ProvinceService } from '../province/province.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MunicipalityService } from '../municipality/municipality.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = environment.apiUrl;
  private currentUser = new BehaviorSubject<UserI | null>(null);
  currentUser$ = this.currentUser.asObservable();
  constructor(
    private readonly provinceService: ProvinceService,
    private readonly http: HttpClient,
    private readonly municipalityService: MunicipalityService
  ) { }

  setCurrentUser(user: UserI | null){
    this.currentUser.next(user);
    localStorage.setItem('user', JSON.stringify(user))

    this.loadLovs();
  }

  loadCurrentUser(){
    const parsedUser = localStorage.getItem('user');
    const currentUser: UserI = parsedUser? JSON.parse(parsedUser) : null;
    if(currentUser){
      this.setCurrentUser(currentUser);
    }

    return currentUser;
  }

  loadLovs(){
    this.provinceService.getMunicipalities().pipe(
      take(1)
    ).subscribe();

    this.provinceService.getSeeds().pipe(
      take(1),
    ).subscribe();

    this.municipalityService.getFarmers().pipe(
      take(1)
    ).subscribe();
  }

  login(body:{username:string| null,password:string | null}){
    const {username, password} = body;
    return this.http.post(`${this.apiUrl}/users/login`,{username, password}).pipe(
      map((users:any)=>{
        return users.map((user:any)=>{
          return {
            ...user,
            userType: user.user_type,
            municipality: user.municipality_id
          }
        })
      })
    )
  }

  clearLovs(){
    this.provinceService.setSeeds([]);
    this.provinceService.setMunicipalities([]);
    this.municipalityService.setFarmers([]);
  }

  logout(){
    this.currentUser.next(null);
    localStorage.removeItem('user');

    this.clearLovs();
  }
}
