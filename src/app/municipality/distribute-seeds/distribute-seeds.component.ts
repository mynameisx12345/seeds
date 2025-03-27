import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProvinceService } from '../../province/province.service';
import { map, startWith, take, tap, withLatestFrom } from 'rxjs';
import { UserService } from '../../user/user.service';
import { SeedI } from '../../shared/models/shared-models';
import { MunicipalityService } from '../municipality.service';

@Component({
  selector: 'app-distribute-seeds',
  templateUrl: './distribute-seeds.component.html',
  styleUrl: './distribute-seeds.component.scss'
})
export class DistributeSeedsComponent implements OnInit{
  distributeForm = this.fb.group({
    municipalityId: ['',Validators.required],
    status:['N', Validators.required],
    seeds: this.fb.array([])
  });

  seeds$ = this.provinceService.seeds$;

  seedsSelection$ = this.seeds$.pipe(
    map((seeds)=>{
      return seeds.sort((a,b)=>{
        if(a.name < b.name){
          return -1;
        } else if(a.name > b.name){
          return 1;
        } else {
          return 0;
        }
      })
    })
  )

  displayedColumns = ['seedId','qtyRemaining', 'uom','qtyToDistribute','farmerId','remarks','menu']


  dataSource = new MatTableDataSource<any>;
  currentUser$ = this.userService.currentUser$;

  farmers$ = this.municipalityService.farmers$.pipe(
    withLatestFrom(this.currentUser$),
    map(([farmers,currentUser])=>{
      return farmers.filter((farmer)=>farmer.municipalityId === currentUser?.municipality)
    })
  );

  distributeId = null;

  quantityChecker$ = this.seedsDistributed.valueChanges.pipe(
    withLatestFrom(this.seeds$),
    withLatestFrom(this.currentUser$),
    map(([[distribution, seeds],currentUser])=>{
      let hasInvalid =  seeds.some((seed)=>{
        let totalQtyDistributed = distribution.filter((dist:any)=>dist.seedId === seed.id)
          .map((dist:any)=>dist.qtyToDistribute)
          .reduce((partialSum:any, a:any) => partialSum + a, 0);
          const qtyRemaining = (seed.qtyRemaining.find((qty)=>qty.municipalityId === currentUser?.municipality)?.qtyRemaining ?? 0)

          console.log('totaldistributed', totalQtyDistributed, qtyRemaining, qtyRemaining < totalQtyDistributed);
        
          if(qtyRemaining< totalQtyDistributed){
            return true;
          } else {
            return false;
          }
      })

      return hasInvalid;

    })
  )
  
  constructor(
    private readonly fb: FormBuilder,
    private readonly provinceService: ProvinceService,
    private readonly userService: UserService,
    private readonly municipalityService: MunicipalityService,
  ){}

  ngOnInit(): void {
    this.currentUser$.pipe(
      tap((user)=>{
        this.distributeForm.patchValue({municipalityId:user?.municipality})
      })
    ).subscribe();

    this.quantityChecker$.pipe(
      tap((res)=>console.log('res',res))
    )
  }

  get seedsDistributed(){
    return this.distributeForm.controls['seeds'] as FormArray
  }

  getFormControl(element:AbstractControl,column:string){
    return (element as FormGroup).get(column) as FormControl
  }

  seedChange(element: FormGroup, newSeed:any){
    this.seeds$.pipe(
      take(1),
      withLatestFrom(this.userService.currentUser$),
      tap(([seeds,currentUser])=>{
        let seed:SeedI | undefined = seeds.find((seed:SeedI)=>seed.id === newSeed.value);
        const _qtyRemaining = seed?.qtyRemaining.find((qty)=>
          qty.warehouseType===currentUser?.userType && 
        (currentUser?.userType === 'municipality' ? 
          currentUser.municipality === qty.municipalityId : true)
      )?.qtyRemaining
        element.patchValue({...element, qtyRemaining: _qtyRemaining ? _qtyRemaining : 0, uom: seed?.uom })
      
      })
    ).subscribe()
  }

  addRow(seedId='',qtyRemaining='',qtyToDistribute='',uom='',remarks='',farmerId= ''){
    let newRow = this.fb.group({
      seedId: [seedId, Validators.required],
      qtyRemaining:[qtyRemaining, Validators.required],
      qtyToDistribute: [qtyToDistribute, Validators.required],
      farmerId:[farmerId,Validators.required],
      uom:[uom, Validators.required],
      remarks: [remarks]
    })

    this.seedsDistributed.push(newRow);
    this.dataSource = new MatTableDataSource(this.seedsDistributed.controls)
  }

  removeRow(rowToDelete:number){
    this.seedsDistributed.removeAt(rowToDelete);
    this.dataSource = new MatTableDataSource(this.seedsDistributed.controls)
  }

  hasOverQuantity(){
    
  }
}
