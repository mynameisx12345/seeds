import { Component, OnInit } from '@angular/core';
import { MenuLinksI } from '../../shared/models/shared-models';
import { MunicipalityService } from '../municipality.service';
import { UserService } from '../../user/user.service';
import { switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-municipality-menu',
  templateUrl: './municipality-menu.component.html',
  styleUrl: './municipality-menu.component.scss'
})
export class MunicipalityMenuComponent implements OnInit{
  links: MenuLinksI[] = []

  currentUser$ = this.userService.currentUser$;

  loadData$ =     this.currentUser$.pipe(
    switchMap((user)=>this.municipalityService.getDistributionByMunicipality(user?.municipality,'S')),
    tap((dist:any)=>{
      this.links = [
        {
          label: 'Farmers', 
          link:'',
          hasNotif: false,
          icon:'nature_people',
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
          hasNotif: dist.length > 0,
          icon: 'forest',
          subLinks:[
            {
              label: 'Receive Seeds',
              link:'/municipality/menu/receive-seeds-list'
            },
            {
              label: 'Distribute Seeds',
              link:'/municipality/menu/distribute-seeds-list'
            }
          ]
        },
        {
          label: 'Reports', 
          link:'',
          hasNotif: false,
          icon:'query_stats',
          subLinks:[
            {
              label: 'Inventory Report',
              link:'/municipality/menu/inventory-report'
            },
            {
              label: 'Farmers Distribution Report',
              link:'/municipality/menu/distribution-report-farmer'
            }
          ]
        },
      ]
    })
  )

  constructor(
    private readonly municipalityService: MunicipalityService,
    private readonly userService:UserService
  ){}

  ngOnInit(): void {
    this.loadData$.pipe(
      take(1)
    ).subscribe()
    setInterval(()=>{
      this.loadData$.subscribe();
    },2000)

  }
}
