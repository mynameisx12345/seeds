import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { SharedComponentsModule } from './shared/shared-components/shared-components.module';
import { SharedModulesModule } from './shared/shared-modules/shared-modules.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes =[
  {
    path:'',
    redirectTo:'user/login',
    pathMatch:'full'
  },
  {
    path: 'user',
    loadChildren: () => import('../app/user/user.module').then(m=>m.UserModule)
  },
  {
    path:'province',
    loadChildren: () => import('../app/province/province.module').then(m=>m.ProvinceModule)
  },
  {
    path: 'municipality',
    loadChildren: () => import('../app/municipality/municipality.module').then(m=>m.MunicipalityModule)
  }
 
]

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    SharedComponentsModule,
    SharedModulesModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  bootstrap:[AppComponent],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient()
  ]
})
export class AppModule { }
