import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './pages/home/home.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { enableIndexedDbPersistence, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { LoginModule } from './pages/login/login.module';
import { CommentService } from './services/comment.service';
import { UserService } from './services/user.service';
import { SharedComponentsModule } from './components/shared-components.module';
import { SettingsModule } from './pages/settings/settings.module';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HomeModule,
    LoginModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    SettingsModule,
    FormsModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => {
      const firestore = getFirestore()
      enableIndexedDbPersistence(firestore)
      return firestore
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, UserService, CommentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
