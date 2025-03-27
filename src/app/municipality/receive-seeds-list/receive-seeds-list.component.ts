import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, filter, switchMap, tap, withLatestFrom } from 'rxjs';
import { MunicipalityService } from '../municipality.service';
import { UserService } from '../../user/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receive-seeds-list',
  templateUrl: './receive-seeds-list.component.html',
  styleUrl: './receive-seeds-list.component.scss'
})
export class ReceiveSeedsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  displayedColumns = ['id','municipalityName', 'statusName','dtSubmitted','dtModified','menu']
  dataSource = new MatTableDataSource;
  loadDistribution$ = new BehaviorSubject(false);
  currentUser$ = this.userService.currentUser$;
  distributions$ = this.loadDistribution$.pipe(
    filter(load=>load),
    withLatestFrom(this.currentUser$),
    switchMap(([load,user])=>this.municipalityService.getDistributionByMunicipality(user?.municipality, 'S')),
    tap(()=>{
      this.loadDistribution$.next(false);
    })
  )
  
  constructor(
    private readonly municipalityService: MunicipalityService,
    private readonly userService: UserService,
    private readonly router: Router
  ){}

  ngOnInit(): void {
    this.loadDistribution$.next(true);
  }

  ngAfterViewInit(): void {
    this.distributions$.pipe(
      tap((distributions:any)=>{
        console.log('distributions', distributions)
        this.dataSource.data = distributions;
        this.dataSource.paginator = this.paginator as MatPaginator;
        this.dataSource.sort = this.sort as MatSort
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

  receive(id:string){
    this.router.navigate(['/municipality/menu/receive-seeds'],{queryParams:{id:id}})
  }

}
