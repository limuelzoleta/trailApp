import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database'
import { serverTimestamp } from '@angular/fire/database';
import { Observable } from 'rxjs';

export interface Comment {
  id?: string,
  content: string,
  createdTime?: string,
  updatedTime?: string,
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private db: AngularFireDatabase) { }

  getComments(userId: string): Observable<any> {
    return this.db.object(`comments/${userId}`).valueChanges() as Observable<any>
  }

  addComment(userId: string, comment: Comment) {
    const commentRef = this.db.list(`comments/${userId}`);
    const timestamp = serverTimestamp();
    commentRef.push({ ...comment, createdTime: timestamp })
  }

  updateComment(userId: string, commentId: string, comment: Comment) {
    const commentRef = this.db.object(`comments/${userId}/${commentId}`);
    const timestamp = serverTimestamp();
    commentRef.update({ ...comment, updatedTime: timestamp });
  }


}
