import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from '../../shared-services/shared-service.service';
import { UserService } from '../../../user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  title$ = this.sharedService.title$;

  currentUser$ = this.userService.currentUser$;
  constructor(
    private readonly sharedService: SharedServiceService,
    private readonly userService: UserService,
    private readonly router: Router
  ){}

  logout(){
    this.userService.logout();
    this.router.navigate(['/user/login'])
  }

  
}
