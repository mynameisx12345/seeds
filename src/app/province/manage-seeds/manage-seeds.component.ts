import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProvinceService } from '../province.service';
import { switchMap, take, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { duration } from 'moment';

@Component({
  selector: 'app-manage-seeds',
  templateUrl: './manage-seeds.component.html',
  styleUrl: './manage-seeds.component.scss'
})
export class ManageSeedsComponent implements AfterViewInit{
  displayedColumns = ['id', 'name','uom','totalRemaining','menu'];
  seeds$ = this.provinceService.seeds$;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  @ViewChild('addSeedModal') addSeedModal:any;

  dataSource = new MatTableDataSource;

  currentDialog:MatDialogRef<any> | null = null;

  addForm = this.fb.group({
    id:[''],
    name:['',Validators.required],
    uom:['', Validators.required],
    qtyRemaining:['', Validators.required],
    qtySpecific: this.fb.array([])
  });

  municipalities$ = this.provinceService.municipalities$;


  constructor(
    private readonly provinceService: ProvinceService,
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder,
    private readonly snackbar: MatSnackBar
  ){}

  get qtySpecific():any{
    return this.addForm.controls['qtySpecific'] as FormArray<any>;
  }

  ngAfterViewInit(): void {
    this.seeds$.pipe(
      tap((seeds)=>{
        this.dataSource.data = seeds.sort((a,b)=>{
          if(a.id > b.id){
            return -1
          } else if (a.id < b.id){
            return 1
          } else {
            return 0
          }
        })
        this.dataSource.paginator = this.paginator as MatPaginator;
        this.dataSource.sort = this.sort  as MatSort;
      })
    ).subscribe();

  

    this.qtySpecific.valueChanges.pipe(
      tap((values:any)=>{
        const total = values.map((value:any)=>value.qtyRemaining)
          .reduce((partialSum:any, a:any) => partialSum + a, 0);
        this.addForm.patchValue({qtyRemaining: total})
      })
    ).subscribe();
  }

 


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearForm(){
    this.addForm.reset();
    this.clearFormArray(this.qtySpecific)
  
  }

  addSeedStart(){
    this.clearForm();
    if(this.qtySpecific.controls.length === 0){
      this.municipalities$.pipe(
        take(1),
        tap((municipalities)=>{
         
          const fgNew = this.fb.group({
            warehouseType:'province',
            qtyRemaining: null,
            municipalityId: null,
            name: 'Province'
          })
          this.qtySpecific.push(fgNew);
  
  
          municipalities.forEach((mun)=>{
            const fgNew = this.fb.group({
              warehouseType:'municipality',
              qtyRemaining: null,
              municipalityId: mun.id,
              name: mun.name
            })
            this.qtySpecific.push(fgNew)
          })
        })
      ).subscribe();
    }
   
    this.currentDialog = this.dialog.open(this.addSeedModal,{
      disableClose: true,
      width: '30%'
    })
  }

  addSeed(){
    const parsed = {
      id: this.addForm.controls['id'].value,
      seedName: this.addForm.controls['name'].value,
      qtyRemaining: this.addForm.controls['qtyRemaining'].value,
      uom: this.addForm.controls['uom'].value,
      qtySpecific: this.qtySpecific.controls.map((qty:any)=>{
        return {
          warehouseType: qty.controls['warehouseType'].value,
          municipalityId: qty.controls['municipalityId'].value,
          qtyRemaining: qty.controls['qtyRemaining'].value ? qty.controls['qtyRemaining'].value : 0
        }
      }) 
      
    }



    this.provinceService.addSeed(parsed).pipe(
      take(1),
      tap(()=>{
        this.snackbar.open('Saved Successfully','',{
          duration:2000,
          verticalPosition:'top'
        })

        this.currentDialog?.close();
       
      }),
      switchMap(()=> this.provinceService.getSeeds()),
      tap(()=>{
      
      })
    ).subscribe()
  }


  getFormControl(element:AbstractControl,column:string){
    return (element as FormGroup).get(column) as FormControl
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  startEdit(element:any){
    this.clearForm();
    this.addForm.patchValue({
      id:element.id,
      name: element.name,
      qtyRemaining: element.totalRemaining,
      uom: element.uom
    })

    element.qtyRemaining.forEach((qty:any)=>{
      const fgNew = this.fb.group({
        warehouseType:qty.warehouseType,
        qtyRemaining: qty.qtyRemaining,
        municipalityId: qty.municipalityId,
        name: qty.warehouseType === 'province' ? 'Province' : qty.municipalityName
      })
      this.qtySpecific.push(fgNew)
      
    })

    this.currentDialog = this.dialog.open(this.addSeedModal,{
      disableClose: true,
      width: '30%'
    })
  }

  deleteSeed(id:any){
    this.provinceService.deleteSeed(id).pipe(
      take(1),
      tap(()=>{
        this.snackbar.open('Deleted Successfully','',{
          duration:2000,
          verticalPosition:'top'
        })
      }),
      switchMap(()=>this.provinceService.getSeeds()),
      tap(()=>{
        
      })
    ).subscribe();
  }
}
