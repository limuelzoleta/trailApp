import { Injectable } from '@angular/core';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Preferences } from '@capacitor/preferences';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { USER_PREFS_PATH } from '../utils/constants';
import { User, UserPreference } from '../utils/definitions';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  user: User;
  preferences: UserPreference;
  DEFAULT_USER_PREFS: UserPreference = {
    minVolumeToPlayAudio: 10,
    theme: 'light',
    iosVoiceProfile: null,
    androidVoiceProfile: null,
    speechRate: 100
  }


  constructor(private firestore: Firestore, userSvc: UserService) {
    this.user = userSvc.getUserDataFromLocalStorage();
  }

  getPreferencesFromFirebase(id: string = this.user.id): Observable<UserPreference> {
    const prefRef = doc(this.firestore, `${id}/${USER_PREFS_PATH}`)
    return docData(prefRef) as Observable<UserPreference>
  }

  savePreference(preferences: UserPreference, id: string = this.user.id) {
    const prefRef = doc(this.firestore, `${id}/${USER_PREFS_PATH}`);
    return setDoc(prefRef, preferences);
  }

  setUserPrefs(id: string = this.user.id): Promise<void> {
    return new Promise((resolve) => {
      this.getPreferencesFromFirebase(id).pipe(take(1))
        .subscribe(async (preferences) => {
          if (preferences) {
            this.preferences = preferences;
            this.setLocalPreferences(this.preferences);
            this.loadPreferences();
          } else {
            await this.setDefaultPrefs(id);
          }
          resolve()
        })
    })
  }

  setDefaultPrefs(id: string = this.user.id): Promise<void> {
    return new Promise((resolve) => {
      this.preferences = this.DEFAULT_USER_PREFS;
      this.savePreference(this.preferences, id);
      this.setLocalPreferences(this.preferences);
      this.loadPreferences();
      resolve()
    })
  }

  async setLocalPreferences(preferences: UserPreference) {
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
