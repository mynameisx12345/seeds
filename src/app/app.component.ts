import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SharedServiceService } from './shared/shared-services/shared-service.service';
import { UserService } from './user/user.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  constructor(
    private readonly sharedServices: SharedServiceService,
    private readonly userService:UserService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ){

  }
  title = 'seed-dist-ui';

  view$ = this.router.events.pipe(
    filter((event)=>event instanceof NavigationEnd),
    map((event:any)=>{
      let viewHdr = false;

      if(event.url !== '/' && event.url !== '/user/login'){
        viewHdr = true;
      }
     
      return viewHdr;
    })
  );
  ngOnInit(): void {
    this.sharedServices.setTitle('Office of Provincial Agricultural Seeds Distribution Monitoring System');
    this.userService.loadCurrentUser();

    console.log('routerurl', this.router.url)

    
  }
}
