import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, filter, map, switchMap, tap, withLatestFrom } from 'rxjs';
import { MunicipalityService } from '../municipality.service';
import { UserService } from '../../user/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-manage-farmers',
  templateUrl: './manage-farmers.component.html',
  styleUrl: './manage-farmers.component.scss'
})
export class ManageFarmersComponent implements OnInit{
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort ?: MatSort;
  currentUser$ = this.userService.currentUser$;
  displayedColumns = ['id','name','contact','address'];
  dataSource = new MatTableDataSource;


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
      console.log('farmers', farmers)
      this.dataSource.data = farmers;
      this.dataSource.paginator = this.paginator as MatPaginator;
      this.dataSource.sort = this.sort as MatSort;
      this.loadFarmers$.next(false);
    })
  )

  constructor(
    private readonly municipalityService:MunicipalityService,
    private readonly userService: UserService
  ){}

  ngOnInit(): void {
    this.farmers$.subscribe();
    this.loadFarmers$.next(true)
  }
}
