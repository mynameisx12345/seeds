import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatestWith, map, startWith, take, tap, withLatestFrom } from 'rxjs';
import { MunicipalityService } from '../../../municipality/municipality.service';
import moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProvinceService } from '../../../province/province.service';
import { UserService } from '../../../user/user.service';

@Component({
  selector: 'app-municipality-distribution-report',
  templateUrl: './municipality-distribution-report.component.html',
  styleUrl: './municipality-distribution-report.component.scss'
})
export class MunicipalityDistributionReportComponent implements OnInit{
  @ViewChild(MatPaginator) paginator?:MatPaginator;
  @ViewChild(MatSort) sort?:MatSort;

  displayedColumns = ['farmersName','seedName', 'qtyDistributed', 'uom','remarks','dtSubmitted','municipalityName'];
  dataSource = new MatTableDataSource;

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    municipality: new FormControl<any>(null)
  });
  currentUser$ = this.userService.currentUser$;


  municipalities$ = this.provinceService.municipalities$.pipe(
    withLatestFrom(this.currentUser$),
    map(([municipalities, user])=>{
      let municipalitiesRet = []
      if(user?.userType === 'municipality'){
        municipalitiesRet = municipalities.filter((mun)=>mun.id === user.municipality)
      } else {
        municipalitiesRet.push({id:-1,name:'All'},...municipalities)
        
      }
      return municipalitiesRet
    })
  )

  loadData$ = this.range.valueChanges.pipe(
    combineLatestWith(this.municipalityService.getDistributionByFarmer()),
    withLatestFrom(this.currentUser$),
    map(([[range,distributions],user])=>{
      let parsed = user?.userType === 'province' ? distributions : distributions.filter((dist:any)=>dist.municipalityId===user?.municipality);

      parsed = (distributions as []).filter((dist:any)=>{
        return (!!(range as any).start ? moment(dist.dtSubmitted).format() >= moment((range as any).start).format() : true ) && 
          (!!(range as any).end ? moment(dist.dtSubmitted).format() <= moment((range as any).end).format() : true)
      });

      

      parsed = parsed.filter((dist:any)=>range.municipality !== -1 ? dist.municipalityId === range.municipality : true)

      this.dataSource.data = parsed as any;
      this.dataSource.paginator = this.paginator as MatPaginator;
      this.dataSource.sort = this.sort as MatSort;
    })
  )

  
  constructor(
    private readonly municipalityService: MunicipalityService,
    private readonly provinceService: ProvinceService,
    private readonly userService: UserService
  ){}

  ngOnInit(): void {
    this.loadData$.subscribe();


    this.currentUser$.pipe(
      take(1),
      tap((user)=>{
        if(user?.userType==='province'){
          this.range.patchValue({municipality: -1})

        } else {
          this.range.patchValue({municipality: user?.municipality})
        }
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
}
