import { Injectable } from '@angular/core';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  FIRESTORE_USER_PREFS_PATH = 'user_prefs';
  constructor(private firestore: Firestore) { }

  getPreferencesFromFirebase(userId: string) {
    const prefRef = doc(this.firestore, `${userId}/${this.FIRESTORE_USER_PREFS_PATH}`)
    return docData(prefRef)
  }

  savePreference(userId: string, preferences: any) {
    const prefRef = doc(this.firestore, `${userId}/${this.FIRESTORE_USER_PREFS_PATH}`);
    console.log(preferences);
    return setDoc(prefRef, preferences);
  }

  setDefaultPrefs(userId: string): Promise<void> {
    return new Promise((resolve) => {
      const preferences = {
        minVolumeToPlayAudio: 10,
        theme: 'light',
        audioMessageVoice: null,
        speechRate: 100
      }
      this.savePreference(userId, preferences);
      this.setLocalPreferences(preferences);
      resolve()
    })
  }

  async setLocalPreferences(preferences: any) {
    for (const [key, value] of Object.entries(preferences)) {
      if (typeof value == 'string') {
        await Preferences.set({ key, value })
      }

      if (typeof value == 'object') {
        await Preferences.set({ key, value: JSON.stringify(value) })
      }

      if (typeof value == 'number') {
        await Preferences.set({ key, value: value.toString(10) })
      }
    }
  }



}
