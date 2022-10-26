import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trailApp';

  constructor(
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      console.log('ready')

      if (!document.body.getAttribute('color-theme')) {
        const theme = await (await Preferences.get({ key: 'theme' })).value
        document.body.setAttribute('color-theme', theme ? theme : '');
      }
    });

  }
}
