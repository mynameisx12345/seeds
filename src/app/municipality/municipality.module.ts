import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MunicipalityMenuComponent } from './municipality-menu/municipality-menu.component';
import { SharedComponentsModule } from '../shared/shared-components/shared-components.module';
import { SharedModulesModule } from '../shared/shared-modules/shared-modules.module';
import { RouterModule, Routes } from '@angular/router';
import { ManageFarmersComponent } from './manage-farmers/manage-farmers.component';
import { ReceiveSeedsComponent } from './receive-seeds/receive-seeds.component';
import { DistributeSeedsComponent } from './distribute-seeds/distribute-seeds.component';
import { ReceiveSeedsListComponent } from './receive-seeds-list/receive-seeds-list.component';
import { DistributeSeedsListComponent } from './distribute-seeds-list/distribute-seeds-list.component';
import { InventoryReportComponent } from '../shared/shared-components/inventory-report/inventory-report.component';

const routes: Routes = [
  {
    path: 'menu',
    component: MunicipalityMenuComponent,
    children: [
      {
        path:'manage-farmers',
        component: ManageFarmersComponent
      },
      {
        path: 'receive-seeds-list',
        component: ReceiveSeedsListComponent
      },
      {
        path: 'distribute-seeds-list',
        component: DistributeSeedsListComponent
      },
      {
        path: 'receive-seeds',
        component: ReceiveSeedsComponent
      },
      {
        path: 'distribute-seeds',
        component: DistributeSeedsComponent
      },
      {
        path: 'inventory-report',
        component: InventoryReportComponent
      }
    ]
  },
  
]

@NgModule({
  declarations: [
    MunicipalityMenuComponent,
    ManageFarmersComponent,
    ReceiveSeedsComponent,
    DistributeSeedsComponent,
    ReceiveSeedsListComponent,
    DistributeSeedsListComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    SharedModulesModule,
    RouterModule.forChild(routes)
  ]
})
export class MunicipalityModule { }
