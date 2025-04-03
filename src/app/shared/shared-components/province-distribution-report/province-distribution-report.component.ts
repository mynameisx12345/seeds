import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProvinceService } from '../../../province/province.service';
import { combineLatestWith, map, startWith, switchMap, tap, withLatestFrom } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
@Component({
  selector: 'app-province-distribution-report',
  templateUrl: './province-distribution-report.component.html',
  styleUrl: './province-distribution-report.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProvinceDistributionReportComponent implements OnInit{
  @ViewChild(MatPaginator) paginator?:MatPaginator;
  @ViewChild(MatSort) sort?:MatSort;
  dataSource = new MatTableDataSource;
  displayedColumns = ['expand','id','municipalityName', 'dtSubmitted', 'statusName'];

  distributions$ = this.provinceService.getDistributions;
  columnsToDisplayWithExpand = [...this.displayedColumns];
  expandedElement:any;

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  loadData$ = this.range.valueChanges.pipe(
    startWith(''),
    combineLatestWith(this.provinceService.getDistributions()),
    map(([range,distributions])=>{
      const parsed = (distributions as []).filter((dist:any)=>{
        return (!!(range as any).start ? moment(dist.dtSubmitted).format() >= moment((range as any).start).format() : true ) && 
          (!!(range as any).end ? moment(dist.dtSubmitted).format() <= moment((range as any).end).format() : true)
      })
      this.dataSource.data = parsed as any;
      this.dataSource.paginator = this.paginator as MatPaginator;
      this.dataSource.sort = this.sort as MatSort;
    })
  )

  constructor(
    private readonly provinceService: ProvinceService
  ){}

  ngOnInit(): void {
    this.loadData$.subscribe()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
