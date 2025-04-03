import { Component, Input, Output } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MenuLinksI } from '../../models/shared-models';
import { Router } from '@angular/router';
import { SharedServiceService } from '../../shared-services/shared-service.service';
@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss'
})
export class MenusComponent {
  @Input() links: MenuLinksI[] | null = [];
  isDesktop = this.deviceDetector.isDesktop()
  constructor(
    private deviceDetector: DeviceDetectorService,
    private readonly router: Router,
    private readonly sharedService:SharedServiceService
  ){}

  title$ = this.sharedService.pageTitle$;

  goToLink(link:any){
    this.sharedService.setPageTitle(link.label)
    this.router.navigate([link.link])

  }
}

