import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment/comment.component';
import { NavComponent } from './nav/nav.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    CommentComponent,
    NavComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    CommentComponent,
    NavComponent
  ]
})
export class SharedComponentsModule { }
