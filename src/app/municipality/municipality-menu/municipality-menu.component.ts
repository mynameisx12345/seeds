import { Component } from '@angular/core';
import { MenuLinksI } from '../../shared/models/shared-models';

@Component({
  selector: 'app-municipality-menu',
  templateUrl: './municipality-menu.component.html',
  styleUrl: './municipality-menu.component.scss'
})
export class MunicipalityMenuComponent {
  links: MenuLinksI[] = [
    {
      label: 'Farmers', 
      link:'',
      subLinks: [
        {
          label:'Manage Farmers',
          link:'/municipality/menu/manage-farmers'
        }
      ]
    },
    {
      label: 'Seeds', 
      link:'',
      subLinks:[
        {
          label: 'Receive Seeds',
          link:'/municipality/menu/receive-seeds-list'
        },
        {
          label: 'Distribute Seeds',
          link:'/municipality/menu/distribute-seeds'
        }
      ]
    },
    {
      label: 'Reports', 
      link:'',
      subLinks:[
        {
          label: 'Inventory Report',
          link:'/municipality/menu/inventory-report'
        }
      ]
    },
  ]
}
