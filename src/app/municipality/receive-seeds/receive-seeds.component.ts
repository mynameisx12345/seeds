import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, startWith, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { ProvinceService } from '../../province/province.service';
import { DistributeDtlI, DistributeHdrI, SeedI } from '../../shared/models/shared-models';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-receive-seeds',
  templateUrl: './receive-seeds.component.html',
  styleUrl: './receive-seeds.component.scss'
})
export class ReceiveSeedsComponent implements OnInit{
  dataSource = new MatTableDataSource<any>;
  displayedColumns = ['seedName','qtyDelivered','uom','qtyToReceive','remarks'];
  distributeForm = this.fb.group({
    id: ['', Validators.required],
    municipality: ['', Validators.required],
    status: ['', Validators.required],
    municipalityName: ['', Validators.required],
    statusName: ['', Validators.required],
    seeds: this.fb.array([])
  })

  seeds$ = this.provinceService.seeds$;
  seeds:SeedI[] =[];
 
  currentDialog: MatDialogRef<any> | null = null;

  @ViewChild('confirm') confirmSave:any;

  constructor(
    private readonly fb:FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly provinceService: ProvinceService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router
  ){}

  ngOnInit(): void {
    this.route.queryParams.pipe(
      take(1),
      tap((param:any)=>{
        if(param['id']){

        }
      }),
      filter(param=>!!param['id']),
      switchMap((param)=>this.provinceService.getDistributions(param['id'])),
      tap((distributionRes:any)=>{
        const [distribution] =distributionRes;
        this.distributeForm.patchValue({
          id: distribution.id,
          municipality: distribution.municipalityId,
          municipalityName: distribution.municipalityName,
          status: distribution.status,
          statusName: distribution.statusName,
          seeds: distribution.details.map((dist:any)=>{
            return {
              seed: dist.seedId,
              qtyRemaining: dist.qtyRemaining,
              qtyToDistribute: parseFloat(dist.qtyDistributed),
              uom: dist.uom,
              remarks: dist.remarks,
              seedName: dist.seedName
            }
          })
        })

        distribution.details.forEach((element:any)=>{
          this.addRow(element)
        })
      })
    ).subscribe();

    this.seeds$.pipe(
      take(1),
      tap((seeds:any)=>{
        this.seeds = seeds;
      })
    ).subscribe();
  }

  filterSeeds(seedId:string){
    return this.seeds.filter((seed:any)=>seed.id===seedId)
  }

  addRow(dtl:DistributeDtlI){
    let newRow = this.fb.group({
      seed:[dtl.seedId, Validators.required],
      qtyDelivered: [parseFloat(dtl.qtyDistributed.toString()), Validators.required],
      uom: [dtl.uom, Validators.required],
      qtyToReceive: ['', Validators.required],
      remarks: [dtl.remarks],
      seedName: [dtl.seedName]
    })

    this.seedsDistributed.push(newRow);
    this.dataSource = new MatTableDataSource(this.seedsDistributed.controls)
  }

  get seedsDistributed() {
    return this.distributeForm.controls["seeds"] as FormArray;
  }

  getFormControl(element:AbstractControl,column:string)
  {
    return (element as FormGroup).get(column) as FormControl
  }

  saveStart(){
    this.currentDialog = this.dialog.open(this.confirmSave, {
      disableClose: true,
      width: '30%'
    })
  }

  confirmSaving(status:string){
    const {municipality, seeds, id} = this.distributeForm.value

    const parsedDet = seeds?.map((seed:any)=>{
      return {
        seedId: seed.seed as string,
        qtyRemaining: seed.qtyRemaining,
        uom: seed.uom,
        qtyDistributed: seed.qtyDelivered,
        qtyReceived: seed.qtyToReceive,
        remarks: seed.remarks
      }
    }) 
    const parsed:DistributeHdrI = {
      id: id as any,
      municipalityId: municipality as string,
      status: status,
      details: parsedDet as DistributeDtlI[]
    }
    this.provinceService.distribute(parsed).pipe(
      take(1),
      tap((res:any)=>{
        this.currentDialog?.close(true);
        const message = status === 'N' ? 'Saved Successfully' : 'Submitted Successfully'
        this.snackbar.open(message,'',{
          verticalPosition:'top',
          duration:3000
        })

          this.router.navigate(['/municipality/menu/receive-seeds-list'])
        
      })
    ).subscribe()
  }

  cancelSaving(){
    this.currentDialog?.close(false);
  }
}
