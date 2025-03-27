import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProvinceService } from '../province.service';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-manage-seeds',
  templateUrl: './manage-seeds.component.html',
  styleUrl: './manage-seeds.component.scss'
})
export class ManageSeedsComponent implements AfterViewInit{
  displayedColumns = ['id', 'name','uom'];
  seeds$ = this.provinceService.seeds$;

  dataSource = new MatTableDataSource;

  constructor(
    private readonly provinceService: ProvinceService
  ){}

  ngAfterViewInit(): void {
    this.seeds$.pipe(
      tap((seeds)=>{
        this.dataSource.data = seeds
      })
    ).subscribe()
  }
}
