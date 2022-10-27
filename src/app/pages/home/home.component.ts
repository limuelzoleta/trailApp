import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonList } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { TextToSpeech } from 'logmaster-capacitor-plugin';
import { PreferenceService } from 'src/app/services/preference.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: any;
  comments: any;
  commentText: string | null;
  commentId: string | null;
  showEditButtons: boolean = false;
  showSpinner = true;
  textToSpeechSupport = false;
  @ViewChild(IonList) slidingList: IonList;
  @ViewChild('scrollContent', { static: false }) scrollContent: IonContent;

  constructor(
    private cmtSvc: CommentService,
  ) { }


  ngOnInit(): void {
    this.cmtSvc.getComments()
      .subscribe(data => {
        this.comments = data
        this.showSpinner = false;
        this.scrollToBottomOnInit()
      })
  }

  scrollToBottomOnInit() {
    const to = setTimeout(() => {
      this.scrollContent.scrollToBottom(500)
      clearTimeout(to);
    }, 300)
  }

  saveComment(speak: boolean = false) {
    console.log(TextToSpeech.getSystemVolume());
    if (this.commentText !== null && this.commentText !== '') {
      const comment = {
        content: this.commentText,
        speak
      }
      if (this.commentId && this.commentText !== null) {
        this.cmtSvc.updateComment(this.commentId, comment, true)
      } else {
        this.cmtSvc.addComment(comment);
      }
      this.commentText = '';
      this.commentId = null;
      this.showEditButtons = false;
    }
  }

  handleChange(e: any) {
    this.commentText = e.target.innerHTML;
  }

  editComment(item: any) {
    this.commentId = item.id;
    this.commentText = item.content
    this.showEditButtons = true;
    this.slidingList.closeSlidingItems()
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }

  cancelEdit() {
    this.commentId = null;
    this.commentText = '';
    this.showEditButtons = false;
  }

}
