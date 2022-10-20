import { Component, OnInit, ViewChild } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { IonList, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CommentComponent } from 'src/app/components/comment/comment.component';

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
  @ViewChild(IonList) slidingList: IonList;
  constructor(
    private cmtSvc: CommentService,
    private auth: AuthService,
    private router: Router) { }


  ngOnInit(): void {
    this.user = this.auth.getUserData();

    this.cmtSvc.getComments(this.user.id)
      .subscribe(data => {
        this.comments = data
      })

    console.log(this.commentId)
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      })
  }

  saveComment() {
    if (this.commentText !== null && this.commentText !== '') {
      const comment = {
        content: this.commentText
      }
      if (this.commentId && this.commentText !== null) {
        this.cmtSvc.updateComment(this.user.id, this.commentId, comment)
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

  editComment(event: any, item: any) {
    this.commentId = item.key;
    this.commentText = item.value.content
    this.showEditButtons = true;
    this.slidingList.closeSlidingItems()
  }

  cancelEdit() {
    this.commentId = null;
    this.commentText = '';
    this.showEditButtons = false;
  }

}
