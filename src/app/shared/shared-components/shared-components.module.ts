import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenusComponent } from './menus/menus.component';
import { SharedModulesModule } from '../shared-modules/shared-modules.module';
import { ModalComponent } from './modal/modal.component';
import { LoaderWholeComponent } from './loader-whole/loader-whole.component';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { ProvinceDistributionReportComponent } from './province-distribution-report/province-distribution-report.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MenusComponent,
    ModalComponent,
    LoaderWholeComponent,
    InventoryReportComponent,
    ProvinceDistributionReportComponent
  ],
  imports: [
    CommonModule,
    SharedModulesModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MenusComponent,
    ModalComponent,
    LoaderWholeComponent,
    InventoryReportComponent,
    ProvinceDistributionReportComponent
  ]
})
export class SharedComponentsModule { }
