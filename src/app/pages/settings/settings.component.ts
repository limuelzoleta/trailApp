import { Component, OnInit } from '@angular/core';
import { PreferenceService } from 'src/app/services/preference.service';
import { UserService } from 'src/app/services/user.service';
import { Platform } from '@ionic/angular';
import { TextToSpeech } from 'logmaster-capacitor-plugin';
import { User, UserPreference } from 'src/app/utils/definitions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  darkThemeEnabled: boolean = false;
  preferences: UserPreference;
  userInfo: User;
  selectedVoice: string;
  voices: any;
  minVolume: number;
  speechRate: number;
  isIOS: boolean;

  constructor(
    private prefSvc: PreferenceService,
    private userSvc: UserService,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.isIOS = this.platform.is("ios");
    this.userInfo = this.userSvc.getUserDataFromLocalStorage()
    this.prefSvc.getPreferencesFromFirebase(this.userInfo.id)
      .subscribe((data) => {
        this.preferences = data;
        this.loadSettings()
      })

    TextToSpeech.getSupportedVoices().then((voices: any) => {
      this.voices = voices.voices;
      let voice = "";
      if (this.isIOS) {
        if (this.preferences && this.preferences.iosVoiceProfile) {
          voice = this.preferences.iosVoiceProfile != "" ? this.preferences.iosVoiceProfile : ""
        }
        this.selectedVoice = voice != "" ? voice : this.getDefaultVoice();
      } else {
        if (this.preferences && this.preferences.androidVoiceProfile) {
          voice = this.preferences.androidVoiceProfile != "" ? this.preferences.androidVoiceProfile : ""
        }
        this.selectedVoice = voice != "" ? voice : this.getDefaultVoice();
        this.selectedVoice = this.preferences ? this.preferences.androidVoiceProfile : voices[0].voiceURI;
      }
    })
  }

  async loadSettings() {
    if (this.preferences) {
      this.darkThemeEnabled = this.preferences.theme == "dark";
      this.minVolume = this.preferences.minVolumeToPlayAudio || 10;
      this.speechRate = this.preferences.speechRate || 100;
    }
  }

  getDefaultVoice() {
    for (let voice of this.voices) {
      if (voice.default || voice.lang.startsWith('en')) {
        return voice.voiceURI
      }
    }
    return this.voices[0].voiceURI
  }

  getEnglishVoices(voices: any) {
    voices.forEach((x: any, i: number) => {
      x.index = i
    });
    return voices.filter((x: any) => x.lang.startsWith('en'))
  }

  async getVoicesForWeb(): Promise<any> {
    return new Promise((resolve) => {
      const speech = window.speechSynthesis;
      if (speech.onvoiceschanged !== undefined) {
        setTimeout(() => {
          const voices = window.speechSynthesis.getVoices()
          resolve(voices)
        }, 1000)
      }
    })

  }

  async handleThemeChange(event: any) {
    if (event.detail.checked) {
      this.preferences.theme = "dark";
      this.darkThemeEnabled = true;
    } else {
      this.preferences.theme = "light";
      this.darkThemeEnabled = false;
    }
    document.body.setAttribute('color-theme', this.preferences.theme);
  }

  handleSelectVoiceChange(event: any) {
    if (this.platform.is("ios")) {
      this.preferences.iosVoiceProfile = event.detail.value;
    } else {
      this.preferences.androidVoiceProfile = event.detail.value;
    }
    this.selectedVoice = event.detail.value
  }

  handleMinVolumeChange(event: any) {
    this.preferences.minVolumeToPlayAudio = event.detail.value;
    this.minVolume = event.detail.value;
  }

  handleSpeechRateChange(event: any) {
    this.preferences.speechRate = event.detail.value;
    this.speechRate = event.detail.value;
  }


  ngOnDestroy() {
    this.prefSvc.setLocalPreferences(this.preferences);
    this.prefSvc.savePreference(this.preferences, this.userInfo.id);
  }
}
