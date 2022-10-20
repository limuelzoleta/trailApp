import { Component, OnInit } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { MenuController } from '@ionic/angular';
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
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      })
  }

}
