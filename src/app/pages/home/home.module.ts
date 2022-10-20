import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomeComponent } from './home.component';
import { HomePageRoutingModule } from './home-routing.module';
import { CommentComponent } from 'src/app/components/comment/comment.component';



@NgModule({
  declarations: [
    HomeComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    HomePageRoutingModule
  ]
})
export class HomeModule { }
