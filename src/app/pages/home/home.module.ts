import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomeComponent } from './home.component';
import { HomePageRoutingModule } from './home-routing.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';



@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    HomePageRoutingModule,
    SharedComponentsModule
  ]
})
export class HomeModule { }
