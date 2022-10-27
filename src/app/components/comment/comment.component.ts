import { Component, Input, OnInit } from '@angular/core';
import { TextToSpeech, TTSOptions } from 'logmaster-capacitor-plugin'
import { CommentService } from 'src/app/services/comment.service';
import { Preferences } from '@capacitor/preferences';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  constructor(
    private commentService: CommentService,
    private alertController: AlertController,
    private platform: Platform
  ) { }
  @Input() comment: any;
  @Input() commentId: any;
  @Input() textToSpeechAvailable: boolean;
  selectedVoice: any;

  ngOnInit(): void {
    if (this.comment.speak) {
      this.processMessage()
    }
  }

  getTimeStamp() {
    if (this.comment.createdTime == null) {
      return 'Saving...';
    }

    let timestamp = this.comment.createdTime.seconds;
    let editedText = '';
    if (this.comment.updatedTime && this.comment.textEdited) {
      editedText = 'Edited '
      timestamp = this.comment.updatedTime.seconds;
    }
    const currentDate = new Date(timestamp * 1000);

    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const mins = currentDate.getMinutes()

    return `${editedText}${currentYear}-${currentDayOfMonth}-${(currentMonth + 1)} ${hours}:${mins}`
  }


  async processMessage() {
    const minVolumePref = await (await Preferences.get({ key: 'minVolumeToPlayAudio' })).value || "10";
    const systemVolume = await (await TextToSpeech.getSystemVolume()).volume
    console.log(systemVolume);
    if (systemVolume > parseInt(minVolumePref, 10)) {
      await this.speakMessage()
    } else {
      await this.showAlertMessage(this.comment.content);
    }
    this.completeSpeechMessage()
  }


  async speakMessage() {
    const speechRatePref = await (await Preferences.get({ key: 'speechRate' })).value || "100";
    try {
      const ttsOptions: TTSOptions = {
        text: this.comment.content,
        lang: 'en-US',
        rate: parseInt(speechRatePref, 10) / 100,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      }

      if (this.platform.is("ios")) {
        const iosVoicePerf = await (await Preferences.get({ key: 'iosVoiceProfile' })).value || "en-US";
        ttsOptions.lang = iosVoicePerf;
      } else {
        const androidVoicePerf = await (await Preferences.get({ key: 'androidVoiceProfile' })).value || "0";
        ttsOptions.voice = parseInt(androidVoicePerf, 10);
      }
      console.log(ttsOptions);
      await TextToSpeech.speak(ttsOptions);

    } catch (e) {
      console.log(e)
    }
  }

  async completeSpeechMessage() {
    const commentItem = { ...this.comment };
    delete commentItem.id;
    this.commentService.updateComment(this.comment.id, { ...commentItem, speak: false }, false)
  }


  async showAlertMessage(message: string, duration: number = 10000) {
    const alert = await this.alertController.create({
      header: 'You received an important message',
      message,
      buttons: ['OK'],
    })

    await alert.present();

    const timeOut = setTimeout(async () => {
      await alert.dismiss();
      clearTimeout(timeOut);

    }, duration)

  }

}
