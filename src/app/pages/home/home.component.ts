import { Component, OnInit } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private cmtSvc: CommentService) { }

  ngOnInit(): void {
    const userId = "vJkRtutt57gsQdpX8yuwDLQFzT02";
    this.cmtSvc.getComments(userId)
      .subscribe((observer) => {
        console.log(observer);
      })
  }

}
