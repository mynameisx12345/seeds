import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ProvinceService } from '../province.service';
import { MatTableDataSource } from '@angular/material/table';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, map, startWith, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { DistributeDtlI, DistributeHdrI, SeedI } from '../../shared/models/shared-models';
import { UserService } from '../../user/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-distribute-seeds',
  templateUrl: './distribute-seeds.component.html',
  styleUrl: './distribute-seeds.component.scss'
})
export class DistributeSeedsComponent implements OnInit, AfterViewInit{
  municipalities$ = this.provinceService.municipalities$;
  seeds$ = this.provinceService.seeds$;
  dataSource = new MatTableDataSource<any>;



  displayedColumns = ['seed','qtyRemaining','uom', 'qtyToDistribute','remarks','menu'];
  
  distributeForm = this.fb.group({
    municipality: ['', Validators.required],
    status: ['N', Validators.required],
    seeds: this.fb.array([])
  })
  seedsSelection$ = this.seedsDistributed.valueChanges.pipe(
    startWith(this.seedsDistributed.value),
    withLatestFrom(this.seeds$),
    map(([selected,seeds])=>{

      return seeds.map((seed)=>{
        return {...seed, isSelected: selected.findIndex((sel:any)=>sel.seed == seed.id) > -1}
      }).sort((a,b)=>{
        if(a.name< b.name){
          return -1;
        } else if(a.name > b.name){
          return 1;
        } else {
          return 0
        }
       
      })
     
    })
  )

  currentDialog: MatDialogRef<any> | null = null;
  @ViewChild('confirm') confirmSave:any;

  showLoader = false;

  distributeId = null;

  constructor(
    private readonly provinceService: ProvinceService,
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router
  ){

   
  }

  get seedsDistributed() {
    return this.distributeForm.controls["seeds"] as FormArray;
  }

  ngAfterViewInit(): void {
    this.provinceService.getSeeds();
   
    setTimeout(()=>{
      this.route.queryParams.pipe(
        take(1),
        tap((param)=>{
          if(param['id']){
            this.distributeId = param['id'];
            this.showLoader = true;
          }
        }),
        filter(param=>!!param['id']),
        switchMap(()=>this.provinceService.getDistributions(this.distributeId)),
        tap((distributionRes:any)=>{
          
          const [distribution] =distributionRes;
          
          this.distributeForm.patchValue({
            municipality: distribution.municipalityId,
            status: distribution.status,
            seeds: distribution.details.map((dist:any)=>{
              return {
                seed: dist.seedId,
                qtyRemaining:parseFloat(dist.qtyRemaining) ,
                qtyToDistribute: dist.qtyDistributed,
                uom: dist.uom,
                remarks: dist.remarks,
               
              }
            })
          });

          distribution.details.forEach((element:any) => {
            this.addRow(element.seedId, element.qtyRemaining,element.qtyDistributed, element.uom, element.remarks)
          });

          this.showLoader = false;
          console.log('distribution', distributionRes,this.distributeForm.value)
        })
      ).subscribe();
    },200)
   
  }

  addRow(seed='',qtyRemaining='',qtyToDistribute='',uom='',remarks=''){
    let newRow = this.fb.group({
      id:[Math.floor(Math.random() * 100) ],
      seed: [seed, Validators.required],
      qtyRemaining:[qtyRemaining, Validators.required],
      qtyToDistribute: [qtyToDistribute, Validators.required],
      uom:[uom, Validators.required],
      remarks: [remarks]
    })

    this.seedsDistributed.push(newRow);
    this.dataSource = new MatTableDataSource(this.seedsDistributed.controls)


    setTimeout(()=>{
      this.seedsDistributed.patchValue([...this.seedsDistributed.value])
    },300)
  }

  removeRow(rowToDelete:number){
    this.seedsDistributed.removeAt(rowToDelete);
    this.dataSource = new MatTableDataSource(this.seedsDistributed.controls)
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

  getFormControl(element:AbstractControl,column:string)
  {
    return (element as FormGroup).get(column) as FormControl
  }

  ngOnInit(): void {
  }

  saveStart(){
    this.currentDialog = this.dialog.open(this.confirmSave, {
      disableClose: true,
      width: '30%'
    })
  }

  confirmSaving(status:string){
    this.showLoader= true;
    const {municipality, seeds} = this.distributeForm.value

    const parsedDet = seeds?.map((seed:any)=>{
      return {
        seedId: seed.seed as string,
        qtyRemaining: seed.qtyRemaining,
        uom: seed.uom,
        qtyDistributed: seed.qtyToDistribute,
        remarks: seed.remarks,
        qtyRecevied: null
      }
    }) 
    const parsed:DistributeHdrI = {
      id: this.distributeId,
      municipalityId: municipality as string,
      status: status,
      details: parsedDet as DistributeDtlI[]
    }
    this.provinceService.distribute(parsed).pipe(
      take(1),
      tap((res:any)=>{
        this.currentDialog?.close(true);
        this.showLoader= false;
        this.distributeId = res.id;
        const message = status === 'N' ? 'Saved Successfully' : 'Submitted Successfully'
        this.snackbar.open(message,'',{
          verticalPosition:'top',
          duration:3000
        })

        // if(status==='S'){
        //   this.router.navigate(['/province/menu/distribute-seeds-list'])
        // }
      }),
      filter(res=>res.status === 'S'),
      switchMap(()=>this.provinceService.getSeeds()),
      tap(()=>{
        this.router.navigate(['/province/menu/distribute-seeds-list'])
      })
    ).subscribe()
    // 


    
    // 
  }

  cancelSaving(){
    this.currentDialog?.close(false);
  }
  
}
