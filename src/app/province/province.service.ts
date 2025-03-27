import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { DistributeHdrI, MunicipalityI, SeedI } from '../shared/models/shared-models';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  apiUrl = environment.apiUrl
  municipalities = new BehaviorSubject<MunicipalityI[]>([]);
  municipalities$ = this.municipalities.asObservable();

  seeds = new BehaviorSubject<SeedI[]>([]);
  seeds$ = this.seeds.asObservable();
  constructor(
    private readonly http: HttpClient
  ) { }

  setMunicipalities(newMunicipalities: MunicipalityI[]){
    this.municipalities.next(newMunicipalities);
  }

  setSeeds(newSeeds: SeedI[]){
    this.seeds.next(newSeeds);
  }

  getMunicipalities(){
    return this.http.get(`${this.apiUrl}/users/municipalities`).pipe(
      tap((resp)=>{
        this.setMunicipalities(resp as MunicipalityI[]);
      })
    )
  }

  getSeeds(){
    return this.http.get(`${this.apiUrl}/province/seeds`).pipe(
     map((resp:any)=>{
      return resp.map((res:any)=>{
        return {
          id: res.id,
          name:res.name,
          totalRemaning: Number(res.total_remaining),
          uom: res.uom,
          qtyTransit: Number(res.qty_transit),
          qtyRemaining: res.qty_remaining.map((rem:any)=>{
            return {
              warehouseType: rem.warehouse_type,
              municipalityId: rem.municipality_id,
              qtyRemaining: parseFloat(rem.qty_remaining)
            }
          })
        }
      })
     }),
     tap((resp)=>{
      this.setSeeds(resp as SeedI[]);
     })
    )
  }

  distribute(distributeData: DistributeHdrI){
    return this.http.post(`${this.apiUrl}/province/distribute`, distributeData).pipe(
      tap((res)=>{
        
      })
    )
  }

  getDistributions(id?:any){
    const idStatement = !!id ? `/${id}` : ''
    return this.http.get(`${this.apiUrl}/province/distribute${idStatement}`)
  }

  getInventoryReport(warehouseType:string, municipalityId:string ='0'){
    return this.http.get(`${this.apiUrl}/province/inventory-report/${warehouseType}/${municipalityId}`).pipe(
      map((inv:any)=>{
        return inv.map(((i:any)=>{
          return {
            seedId: i.seed_id,
            seedName: i.seed_name,
            qtyRemaining: parseFloat(i.qty_remaining),
            uom: i.uom
          }
        }))
      })
    )
  }
}
