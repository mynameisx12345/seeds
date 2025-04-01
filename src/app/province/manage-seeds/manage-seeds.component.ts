import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProvinceService } from '../province.service';
import { switchMap, take, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { duration } from 'moment';

@Component({
  selector: 'app-manage-seeds',
  templateUrl: './manage-seeds.component.html',
  styleUrl: './manage-seeds.component.scss'
})
export class ManageSeedsComponent implements AfterViewInit{
  displayedColumns = ['id', 'name','uom','totalRemaining'];
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
    quantity:['', Validators.required]
  })

  constructor(
    private readonly provinceService: ProvinceService,
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder,
    private readonly snackbar: MatSnackBar
  ){}

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
    ).subscribe()
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addSeedStart(){
    this.currentDialog = this.dialog.open(this.addSeedModal,{
      disableClose: true,
      width: '30%'
    })
  }

  addSeed(){
    const parsed = {
      seedName: this.addForm.controls['name'].value,
      qtyRemaining: this.addForm.controls['quantity'].value,
      uom: this.addForm.controls['uom'].value
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
      switchMap(()=> this.provinceService.getSeeds())
    ).subscribe()
  }
}
