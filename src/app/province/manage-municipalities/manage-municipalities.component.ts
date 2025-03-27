import { AfterViewInit, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProvinceService } from '../province.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-manage-municipalities',
  templateUrl: './manage-municipalities.component.html',
  styleUrl: './manage-municipalities.component.scss'
})
export class ManageMunicipalitiesComponent implements AfterViewInit{
  municipalities$ = this.provinceService.municipalities$;
  displayedColumns = ['id', 'name'];
  dataSource = new MatTableDataSource;

  constructor(
    private readonly provinceService: ProvinceService
  ){}

  ngAfterViewInit(): void {
    this.municipalities$.pipe(
      tap((municipalities)=>{
        this.dataSource.data = municipalities;
      })
    ).subscribe();
  }
}
