import { Component, OnInit, ViewChild } from '@angular/core';
import { ProvinceService } from '../province.service';
import { BehaviorSubject, filter, switchMap, tap } from 'rxjs';
import { DistributeHdrI } from '../../shared/models/shared-models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-distribute-seeds-list',
  templateUrl: './distribute-seeds-list.component.html',
  styleUrl: './distribute-seeds-list.component.scss'
})
export class DistributeSeedsListComponent implements OnInit{
  displayedColumns = ['id', 'municipalityName', 'statusName','dtCreated','dtModified', 'dtSubmitted','menu'];
  dataSource = new MatTableDataSource<DistributeHdrI | null>;
  loadDistributions$ = new BehaviorSubject(false);
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  distributions$ = this.loadDistributions$.pipe(
    filter(load=>load),
    switchMap(()=>this.provinceService.getDistributions()),
    tap((distributions:any)=>{
      this.dataSource.data = distributions.filter((dist:any)=>dist.status !== 'R');
      this.dataSource.paginator = this.paginator as MatPaginator;
      this.dataSource.sort = this.sort as MatSort;
      this.loadDistributions$.next(false);
    })
  ).subscribe();

  constructor(
    private readonly provinceService: ProvinceService,
    private readonly router: Router
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
    this.router.navigate(['/province/menu/distribute-seeds'],{queryParams:{id:id}})
  }
}
