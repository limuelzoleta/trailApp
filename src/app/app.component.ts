import { Component } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { PreferenceService } from './services/preference.service';
import { UserService } from './services/user.service';
import { initializeAuth, indexedDBLocalPersistence } from '@firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trailApp';
  user: any;

  constructor(
    private platform: Platform,
    private prefService: PreferenceService,
    private userService: UserService,
  ) {
    this.loadSettings();
    this.initializeFirebase();
    this.user = this.userService.getUserDataFromLocalStorage();
  }

  loadSettings() {
    this.platform.ready().then(() => {
      if (Object.keys(this.user).length > 0) {
        this.prefService.setUserPrefs();
      }
    })
  }

  initializeFirebase() {
    const app = initializeApp(environment.firebase);
    if (Capacitor.isNativePlatform()) {
      initializeAuth(app, {
        persistence: indexedDBLocalPersistence
      });
    }
  }
}
