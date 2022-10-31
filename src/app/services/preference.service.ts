import { Injectable } from '@angular/core';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Preferences } from '@capacitor/preferences';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  FIRESTORE_USER_PREFS_PATH = 'user_prefs';
  user: any = {};
  preferences: any;
  DEFAULT_USER_PREFS = {
    minVolumeToPlayAudio: 10,
    theme: 'light',
    iosVoiceProfile: null,
    androidVoiceProfile: null,
    speechRate: 100
  }


  constructor(private firestore: Firestore, userSvc: UserService) {
    this.user = userSvc.getUserDataFromLocalStorage();
  }

  getPreferencesFromFirebase(id = this.user.id) {
    const prefRef = doc(this.firestore, `${id}/${this.FIRESTORE_USER_PREFS_PATH}`)
    return docData(prefRef)
  }

  savePreference(preferences: any, id = this.user.id) {
    const prefRef = doc(this.firestore, `${id}/${this.FIRESTORE_USER_PREFS_PATH}`);
    return setDoc(prefRef, preferences);
  }

  setUserPrefs(id = this.user.id) {
    if (!this.user.id)
      this.getPreferencesFromFirebase(id)
        .subscribe((preferences) => {
          if (preferences) {
            this.preferences = preferences;
            this.setLocalPreferences(this.preferences);
            this.loadPreferences();
          } else {
            this.setDefaultPrefs(id);
          }
        })
  }

  setDefaultPrefs(id = this.user.id): Promise<void> {
    return new Promise((resolve) => {
      this.preferences = this.DEFAULT_USER_PREFS;
      this.savePreference(this.preferences, id);
      this.setLocalPreferences(this.preferences);
      this.loadPreferences();
      resolve()
    })
  }

  async setLocalPreferences(preferences: any) {
    for (const [key, value] of Object.entries(preferences)) {
      if (typeof value == 'string') {
        await Preferences.set({ key, value })
      }

      if (typeof value == 'object' && value !== null) {
        await Preferences.set({ key, value: JSON.stringify(value) })
      }

      if (typeof value == 'number') {
        await Preferences.set({ key, value: value.toString(10) })
      }

      if (value === null) {
        await Preferences.set({ key, value: "" })
      }
    }
  }


  loadPreferences() {
    const { theme } = this.preferences;
    document.body.setAttribute('color-theme', theme ? theme : '');
  }

}
