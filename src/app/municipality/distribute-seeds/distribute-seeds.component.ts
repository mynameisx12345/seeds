import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProvinceService } from '../../province/province.service';
import { filter, map, startWith, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { UserService } from '../../user/user.service';
import { MDistributeDtlI, MDistributeHdrI, SeedI } from '../../shared/models/shared-models';
import { MunicipalityService } from '../municipality.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-distribute-seeds',
  templateUrl: './distribute-seeds.component.html',
  styleUrl: './distribute-seeds.component.scss'
})
export class DistributeSeedsComponent implements OnInit, AfterViewInit{
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

  currentDialog: MatDialogRef<any> | null = null;
  @ViewChild('confirm') confirmSave:any;

  
  constructor(
    private readonly fb: FormBuilder,
    private readonly provinceService: ProvinceService,
    private readonly userService: UserService,
    private readonly municipalityService: MunicipalityService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute
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

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.route.queryParams.pipe(
        take(1),
        tap((param)=>{
          if(param['id']){
            this.distributeId = param['id'];
          }
        }),
        filter((param)=>!!param['id']),
        switchMap(()=>this.municipalityService.getDistribution(this.distributeId)),
        tap((distributionRes:any)=>{
          const [distribution] = distributionRes;

          this.distributeForm.patchValue({
            municipalityId: distribution.municipalityId,
            status: distribution.status,
            seeds: distribution.details.map((dist:any)=>{
              return {
                seed: dist.seedId,
                qtyRemaining:parseFloat(dist.qtyRemaining) ,
                qtyToDistribute: dist.qtyDistributed,
                uom: dist.uom,
                remarks: dist.remarks,
                farmerId: dist.farmerId
              }
            })
          });

          distribution.details.forEach((element:any) => {
            this.addRow(element.seedId, element.qtyRemaining,element.qtyDistributed, element.uom, element.remarks, element.farmerId)
          });
        })
      ).subscribe();
    })
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

  confirmSaving(status: string){
    const {municipalityId, seeds} = this.distributeForm.value;
    const parsedDet = seeds?.map((seed:any)=>{
      return {
        seedId: seed.seedId,
        qtyRemaining: seed.qtyRemaining,
        uom: seed.uom,
        qtyDistributed: seed.qtyToDistribute,
        remarks: seed.remarks,
        farmerId: seed.farmerId
      }
    })

    const parsed:MDistributeHdrI = {
      id: this.distributeId,
      municipalityId: municipalityId as string,
      status: status,
      details: parsedDet as MDistributeDtlI[]
    }

    this.municipalityService.distribute(parsed).pipe(
      take(1),
      tap((res:any)=>{
        this.currentDialog?.close(true);

        this.distributeId = res.id;
        const message = status === 'N' ? 'Saved Successfully' : 'Submitted Successfully'
        this.snackbar.open(message,'',{
          verticalPosition:'top',
          duration:3000
        })
      }),
      filter(res=>res.status === 'S'),
      switchMap(()=>this.provinceService.getSeeds()),
      tap(()=>{
        this.router.navigate(['/municipality/menu/distribute-seeds-list'])
      })
    ).subscribe()
  }

  cancelSaving(){
    this.currentDialog?.close(false);
  }

  saveStart(){
    this.currentDialog = this.dialog.open(this.confirmSave, {
      disableClose: true,
      width: '30%'
    })
  }
}
