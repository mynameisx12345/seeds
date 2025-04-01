import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { FarmerI, MDistributeHdrI } from '../shared/models/shared-models';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityService {
  apiUrl = environment.apiUrl;

  private farmers = new BehaviorSubject<FarmerI[]>([]);
  farmers$ = this.farmers.asObservable();
  constructor(
    private readonly http: HttpClient
  ) { }

  getDistributionByMunicipality(municipalityId:any, status: 'N' | 'S' | 'R'){
    return this.http.get(`${this.apiUrl}/province/distribute/${municipalityId}/${status}`)
  }

  setFarmers(newFarmers:FarmerI[]){
    this.farmers.next(newFarmers);
  }

  getFarmers(){
    return this.http.get(`${this.apiUrl}/municipality/farmers`).pipe(
      tap((farmers:any)=>{
        const parsed = farmers.map((farmer:any)=>{
          return {
            ...farmer,
            municipalityId: farmer.municipality_id
          }
        })

        this.setFarmers(parsed);
      })
    )
  }

  distribute(distributeData: MDistributeHdrI){
    return this.http.post(`${this.apiUrl}/municipality/distribute`, distributeData);
  }

  getDistribution(id?:any){
    const idStatement = !!id ? `/${id}` : ''
    return this.http.get(`${this.apiUrl}/municipality/distribute${idStatement}`)
  }

  
}
