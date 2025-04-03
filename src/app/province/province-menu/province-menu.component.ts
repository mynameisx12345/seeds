import { Component } from '@angular/core';
import { MenuLinksI } from '../../shared/models/shared-models';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

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
      hasNotif: false,
      icon: 'group',
      subLinks: [
        // {
        //   label:'Manage Accounts',
        //   link:'/province/menu/manage-account'
        // },
        {
          label:'Manage Municipalities',
          link:'/province/menu/manage-municipalities'
        }
      ]
    },
    {
      label: 'Seeds', 
      link:'',
      icon: 'forest',
      hasNotif: false,
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
      icon: 'query_stats',
      hasNotif: false,
      subLinks:[
        {
          label: 'Inventory Report',
          link:'/province/menu/inventory-report'
        },
        {
          label: 'Province Distribution Report',
          link:'/province/menu/distribution-report'
        },
        {
          label: 'Farmers Distribution Report',
          link:'/province/menu/distribution-report-farmer'
        },

      ]
    },
  ]

  view$ = this.router.events.pipe(
    filter((event)=>event instanceof NavigationEnd),
    map((event:any)=>{
      console.log('url', event.url)
      let viewHdr = false;

      if(event.url !== '/' && event.url !== '/user/login'){
        viewHdr = true;
      }
     
      return viewHdr;
    })
  ).subscribe();

  constructor(
    private readonly router: Router
  ){}
}
