import {Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, filter, switchMap, tap, withLatestFrom } from 'rxjs';
import { MunicipalityService } from '../municipality.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UserService } from '../../user/user.service';


@Component({
  selector: 'app-distribute-seeds-list',
  templateUrl: './distribute-seeds-list.component.html',
  styleUrl: './distribute-seeds-list.component.scss'
})
export class DistributeSeedsListComponent implements OnInit{
  displayedColumns = ['id', 'municipalityName', 'statusName','dtCreated','dtModified', 'dtSubmitted','menu'];
  dataSource = new MatTableDataSource;
  @ViewChild(MatPaginator) paginator?:MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  loadDistributions$ = new BehaviorSubject(false);
  
  distributions$ = this.loadDistributions$.pipe(
    filter(load=>load),
    switchMap(()=>this.municipalityService.getDistribution()),
    withLatestFrom(this.userService.currentUser$),
    tap(([distributions, currentUser])=>{
      this.dataSource.data = (distributions as any).filter((dist:any)=>dist.status !== 'S' && currentUser?.municipality === dist.municipalityId);
      this.dataSource.paginator = this.paginator as MatPaginator;
      this.dataSource.sort = this.sort as MatSort;
      this.loadDistributions$.next(false);
    })
  ).subscribe()

  constructor(
    private readonly municipalityService: MunicipalityService,
    private readonly router: Router,
    private readonly userService: UserService
  ){}

  ngOnInit(): void {
    this.loadDistributions$.next(true);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  startDistribution(id?:string){
    this.router.navigate(['/municipality/menu/distribute-seeds'],{queryParams:{id:id}})
  }
}
