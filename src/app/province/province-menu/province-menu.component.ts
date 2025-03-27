import { Component } from '@angular/core';
import { MenuLinksI } from '../../shared/models/shared-models';

@Component({
  selector: 'app-province-menu',
  templateUrl: './province-menu.component.html',
  styleUrl: './province-menu.component.scss'
})
export class ProvinceMenuComponent {
  links: MenuLinksI[] = [
    {
      label: 'Accounts', 
      link:'',
      subLinks: [
        {
          label:'Manage Accounts',
          link:'/province/menu/manage-account'
        },
        {
          label:'Manage Municipalities',
          link:'/province/menu/manage-municipalities'
        }
      ]
    },
    {
      label: 'Seeds', 
      link:'',
      subLinks:[
        {
          label: 'Manage Seeds',
          link:'/province/menu/manage-seeds'
        },
        {
          label: 'Distribute Seeds',
          link:'/province/menu/distribute-seeds-list'
        }
      ]
    },
    {
      label: 'Reports', 
      link:'',
      subLinks:[
        {
          label: 'Inventory Report',
          link:'/province/menu/inventory-report'
        },
        {
          label: 'Distribution Report',
          link:'/province/menu/distribution-report'
        },
        {
          label: 'Municipality Distribution Report',
          link:'/province/menu/distribution-report'
        },

      ]
    },
  ]
}
