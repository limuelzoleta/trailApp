import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { PreferenceService } from './services/preference.service';
import { UserService } from './services/user.service';

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
    this.initializeApp();
    this.user = this.userService.getUserDataFromLocalStorage();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Object.keys(this.user).length > 0) {
        this.prefService.setUserPrefs();
      }
    })
  }
}
