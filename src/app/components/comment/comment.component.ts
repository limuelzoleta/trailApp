import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  constructor() { }
  @Input() comment: any;
  @Input() commentId: any;

  ngOnInit(): void {
  }

  getTimeStamp() {
    let timestamp = parseInt(this.comment.createdTime, 10);
    let editedText = '';
    if (this.comment.updatedTime) {
      editedText = 'Edited '
      timestamp = parseInt(this.comment.updatedTime, 10);
    }
    const currentDate = new Date(timestamp);

    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
    const currentYear = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const mins = currentDate.getMinutes()

    return `${editedText}${currentYear}-${currentDayOfMonth}-${(currentMonth + 1)} ${hours}:${mins}`
  }

}
