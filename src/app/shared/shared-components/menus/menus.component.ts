import { Component, Input, Output } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MenuLinksI } from '../../models/shared-models';
import { Router } from '@angular/router';
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
    private readonly router: Router
  ){}

  goToLink(link:string){
    this.router.navigate([link])
  }
}

