import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedServiceService } from './shared/shared-services/shared-service.service';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  constructor(
    private readonly sharedServices: SharedServiceService,
    private readonly userService:UserService
  ){

  }
  title = 'seed-dist-ui';
  ngOnInit(): void {
    this.sharedServices.setTitle('Office of Provincial Agricultural Distribution Monitoring System');
    this.userService.loadCurrentUser();
  }
}
