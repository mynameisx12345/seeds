import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {USERS} from '../../shared/constants/shared-constant';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, tap } from 'rxjs';
import { SharedServiceService } from '../../shared/shared-services/shared-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  devs = [
    'PRINCE KYLE  MANALO',
    'ADRIAN TAMBA',
    'JOHN LOREN MODESTO',
    'ANTHON JOHN NECOR'
  ]

  fgLogin = this.fb.group({
    username:['', Validators.required],
    password: ['', Validators.required]
  })

  title$ = this.sharedService.title$;
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar,
    private readonly sharedService: SharedServiceService,
  ){}

  login(){
    this.userService.login({username:this.fgLogin.controls['username'].value, password: this.fgLogin.controls['password'].value}).pipe(
      take(1),
      tap((res:any)=>{
        if(res.length > 0){
          this.userService.setCurrentUser(res[0]);
          
          this.snackbar.open('Login Successfully', '', {
            verticalPosition:'top',
            duration: 2000
          });

          if(res[0].userType === 'province'){
            this.router.navigate(['/province/menu']);
          } else {
            this.router.navigate(['/municipality/menu']);
          }
        }else {
          this.snackbar.open('Login Failed', '', {
            verticalPosition:'top',
            duration: 2000
          })
        }
      })
    ).subscribe();
    
  }
}
