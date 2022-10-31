import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonList } from '@ionic/angular';
import { CommentService } from 'src/app/services/comment.service';
import { Comment, User } from 'src/app/utils/definitions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User;
  comments: Comment[];
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
    if (this.commentText !== null && this.commentText !== '') {
      const comment: Comment = {
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

  editComment(item: Comment) {
    if (item.id) {
      this.commentId = item.id;
      this.commentText = item.content
      this.showEditButtons = true;
    }
    this.slidingList.closeSlidingItems()
  }

  trackByFn(index: number, item: Comment): string {
    return item.id ? item.id : '';
  }

  cancelEdit() {
    this.commentId = null;
    this.commentText = '';
    this.showEditButtons = false;
  }

}
