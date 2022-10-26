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
    private auth: AuthService,
    private userSvc: UserService,
    private prefSvc: PreferenceService,
    private router: Router) { }


  ngOnInit(): void {
    this.user = this.userSvc.getUserDataFromLocalStorage();
    if (!this.user.displayName) {
      this.user.displayName = '';
      this.userSvc.getUserInfo(this.user.id).subscribe((data) => {
        this.user.displayName = data.displayName;
        this.userSvc.saveUserToLocalStorage(this.user);
      });
    }

    this.cmtSvc.getComments(this.user.id)
      .subscribe(data => {
        this.comments = data
        this.showSpinner = false;
        this.scrollToBottomOnInit()
      })

    this.initializeSettings()
  }

  async initializeSettings() {
    this.prefSvc.getPreferencesFromFirebase(this.user.id)
      .subscribe(async (data) => {
        if (!data) {
          await this.prefSvc.setDefaultPrefs(this.user.id);
        } else {
          this.prefSvc.setLocalPreferences(data);
        }
      })
    if (!document.body.getAttribute('color-theme')) {
      const theme = await (await Preferences.get({ key: 'theme' })).value
      document.body.setAttribute('color-theme', theme ? theme : '');
    }
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
        this.cmtSvc.updateComment(this.user.id, this.commentId, comment, true)
      } else {
        this.cmtSvc.addComment(this.user.id, comment);
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
