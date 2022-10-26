import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SettingsComponent } from './settings.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SharedComponentsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SettingsModule { }
