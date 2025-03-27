import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../user/user.service';
import { FormControl } from '@angular/forms';
import { map, switchMap, tap, withLatestFrom } from 'rxjs';
import { ProvinceService } from '../../../province/province.service';
import { getLocaleNumberSymbol } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrl: './inventory-report.component.scss'
})
export class InventoryReportComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort?:MatSort;
  @ViewChild(MatPaginator) paginator?:MatPaginator;
  displayedColumns = ['seedId', 'seedName', 'qtyRemaining','uom']
  currentUser$ = this.userService.currentUser$;
  dataSource = new MatTableDataSource;
  municipality = new FormControl('');
  municipalities$ = this.provinceService.municipalities$.pipe(
    withLatestFrom(this.currentUser$),
    map(([municipalities,currentUser])=>{
      if(currentUser?.userType === 'province'){
        return [...municipalities, {id:'-1', name:'Province', province:'Province'}]
      } else {
        return [municipalities.find(mun=>mun.id === currentUser?.municipality)]
      }
      
    })
  )

  report$ = this.municipality.valueChanges.pipe(
    switchMap((mun)=>{
      const warehouseType = mun === '-1' ? 'province' : 'municipality'
      return this.provinceService.getInventoryReport(warehouseType, mun as string) ;
    }),
    tap((rep)=>{
      this.dataSource.data = rep;
      this.dataSource.sort = this.sort as MatSort;
      this.dataSource.paginator = this.paginator as MatPaginator;
    })
  )
  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly provinceService: ProvinceService
  ){}

  ngOnInit(): void {
    this.report$.subscribe();
    this.userService.currentUser$.pipe(
      tap((user)=>{
        if(user?.userType==='municipality'){
          this.municipality.setValue(user.municipality)
        } else {
          this.municipality.setValue('-1');
        }
        
      })
    ).subscribe();
    
  }

  ngAfterViewInit(): void {
    
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  
}
