import { Component, Input, OnInit } from '@angular/core';
import { TextToSpeech, TTSOptions } from 'logmaster-capacitor-plugin'
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  constructor(private commentService: CommentService, private userService: UserService, private alertController: AlertController) { }
  @Input() comment: any;
  @Input() commentId: any;
  @Input() textToSpeechAvailable: boolean;
  selectedVoice: any;

  ngOnInit(): void {
    if (this.comment.speak) {
      this.speakMessage()
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

  async speakMessage() {
    const voicePref = await (await Preferences.get({ key: 'audioMessageVoice' })).value || '""';
    const speechRatePref = await (await Preferences.get({ key: 'speechRate' })).value || "100";
    const minVolumePref = await (await Preferences.get({ key: 'minVolumeToPlayAudio' })).value || "10";

    try {
      const ttsOptions: TTSOptions = {
        text: this.comment.content,
        lang: 'en-US',
        rate: parseInt(speechRatePref, 10) / 100,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',

      }
      if (voicePref != 'null') {
        const voice = JSON.parse(voicePref);
        ttsOptions.voice = voice.index;
      }
      if ((await TextToSpeech.getSystemVolume()).volume > parseInt(minVolumePref, 10)) {
        await TextToSpeech.speak(ttsOptions);
      } else {
        await this.showAlertMessage(this.comment.content);
      }
      const user = this.userService.getUserDataFromLocalStorage();
      const commentItem = { ...this.comment };
      delete commentItem.id;
      this.commentService.updateComment(user.id, this.comment.id, { ...commentItem, speak: false }, false)
    } catch (e) {
      console.log(e)
    }
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
