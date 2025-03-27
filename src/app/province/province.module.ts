import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProvinceMenuComponent } from './province-menu/province-menu.component';
import { SharedComponentsModule } from '../shared/shared-components/shared-components.module';
import { SharedModulesModule } from '../shared/shared-modules/shared-modules.module';
import { RouterModule, Routes } from '@angular/router';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { ManageMunicipalitiesComponent } from './manage-municipalities/manage-municipalities.component';
import { ManageSeedsComponent } from './manage-seeds/manage-seeds.component';
import { DistributeSeedsComponent } from './distribute-seeds/distribute-seeds.component';
import { DistributeSeedsListComponent } from './distribute-seeds-list/distribute-seeds-list.component';
import { InventoryReportComponent } from '../shared/shared-components/inventory-report/inventory-report.component';
import { ProvinceDistributionReportComponent } from '../shared/shared-components/province-distribution-report/province-distribution-report.component';

const routes: Routes = [
  {
    path: 'menu',
    component: ProvinceMenuComponent,
    children:[
      {
        path: 'manage-account',
        component: ManageAccountComponent
      },
      {
        path: 'manage-municipalities',
        component: ManageMunicipalitiesComponent
      },
      {
        path: 'manage-seeds',
        component: ManageSeedsComponent
      },
      {
        path: 'distribute-seeds',
        component: DistributeSeedsComponent
      },
      {
        path: 'distribute-seeds-list',
        component: DistributeSeedsListComponent
      },
      {
        path: 'inventory-report',
        component: InventoryReportComponent
      },
      {
        path: 'distribution-report',
        component: ProvinceDistributionReportComponent
      }
    ]
  },

]


@NgModule({
  declarations: [
    ProvinceMenuComponent,
    ManageAccountComponent,
    ManageMunicipalitiesComponent,
    ManageSeedsComponent,
    DistributeSeedsComponent,
    DistributeSeedsListComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    SharedModulesModule,
    RouterModule.forChild(routes)
  ]
})
export class ProvinceModule { }
