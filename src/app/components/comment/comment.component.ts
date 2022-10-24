import { Component, Input, OnInit } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  constructor(private commentService: CommentService, private userService: UserService) { }
  @Input() comment: any;
  @Input() commentId: any;
  @Input() textToSpeechAvailable: boolean;

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
    const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
    const currentYear = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const mins = currentDate.getMinutes()

    return `${editedText}${currentYear}-${currentDayOfMonth}-${(currentMonth + 1)} ${hours}:${mins}`
  }

  async speakMessage() {
    // await TextToSpeech.stop()
    const languages = TextToSpeech.getSupportedLanguages();
    console.log(languages)
    try {
      console.log("using library")
      await TextToSpeech.speak({
        text: this.comment.content,
        lang: 'en-US',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      })

      const user = this.userService.getUserDataFromLocalStorage();

      const commentItem = { ...this.comment };
      delete commentItem.id;
      this.commentService.updateComment(user.id, this.comment.id, { ...commentItem, speak: false }, false)
    } catch (e) {
      console.log(e)
    }
  }

}
