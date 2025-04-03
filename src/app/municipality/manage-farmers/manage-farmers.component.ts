import { AfterViewInit, Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { MunicipalityService } from '../municipality.service';
import { UserService } from '../../user/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { ProvinceService } from '../../province/province.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-farmers',
  templateUrl: './manage-farmers.component.html',
  styleUrl: './manage-farmers.component.scss'
})
export class ManageFarmersComponent implements OnInit, AfterViewInit{
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort ?: MatSort;
  @ViewChild('addFarmerModal') addFarmerModal:any;
  currentUser$ = this.userService.currentUser$;
  displayedColumns = ['id','name','contact','address','menu'];
  dataSource = new MatTableDataSource;
  currentDialog: MatDialogRef<any> | any;

  loadFarmers$ = new BehaviorSubject(false);
  farmers$ = this.loadFarmers$.pipe(
    filter(load=>load),
    switchMap(()=>this.municipalityService.farmers$),
    withLatestFrom(this.currentUser$),
    map(([farmers,currentUser])=>{
      console.log('farmers1', farmers)
      return farmers.filter((farmer:any)=>{
        return currentUser?.userType === 'municipality' ? farmer.municipalityId === currentUser.municipality : true;
      })
    }),
    tap((farmers)=>{
      this.dataSource.data = farmers.sort((a,b)=>{
        if(a.id > b.id){
          return -1
        } else if(a.id < b.id){
          return 1
        } else {
          return 0
        }
      });
      this.dataSource.paginator = this.paginator as MatPaginator;
      this.dataSource.sort = this.sort as MatSort;
      this.loadFarmers$.next(false);
    })
  )

  seeds$  = this.provinceService.seeds$;

  fgFarmer = this.fb.group({
    id:[''],
    name:['',Validators.required],
    contact:['',Validators.required],
    address: ['',Validators.required],
    municipalityId:['']
  })

  constructor(
    private readonly municipalityService:MunicipalityService,
    private readonly userService: UserService,
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder,
    private readonly provinceService: ProvinceService,
    private readonly snackbar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.farmers$.subscribe();
   
  }

  ngAfterViewInit(): void {
    this.loadFarmers$.next(true)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addFarmer(){
    this.currentUser$.pipe(
      take(1),
      map((user)=>{
        const parsed ={
          ...this.fgFarmer.value,
          municipalityId: user?.municipality
        }
        return parsed
      }),
      switchMap((payload)=>this.municipalityService.addFarmer(payload)),
      tap(()=>{
        this.snackbar.open('Saved Successfully','',{
          duration:2000,
          verticalPosition:'top'
        });
        this.currentDialog.close();
        
      }),
      switchMap(()=>this.municipalityService.getFarmers()),
      tap(()=>{
        this.fgFarmer.reset();
        this.loadFarmers$.next(true);
      })
    ).subscribe();
  }

  startAdd(){
    this.fgFarmer.reset();
    this.currentDialog = this.dialog.open(this.addFarmerModal,{
      width: '40%',
      disableClose: true
    })
  }

  startEdit(element:any){
      this.fgFarmer.patchValue({
        id: element.id,
        name: element.name,
        contact: element.contact,
        address: element.address,
      });

      this.currentDialog = this.dialog.open(this.addFarmerModal,{
        width: '40%',
        disableClose: true
      })
  }

  deleteFarmer(id:any){
    this.municipalityService.deleteFarmer(id).pipe(
      take(1),
      tap(()=>{
        this.snackbar.open('Deleted Successfully','',{
          duration:2000,
          verticalPosition:'top'
        })
      }),
      switchMap(()=>this.municipalityService.getFarmers()),
      tap(()=>{
        this.loadFarmers$.next(true)
      })
    ).subscribe()
  }
}
