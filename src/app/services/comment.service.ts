import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database'
import { serverTimestamp } from '@angular/fire/database';
import { Observable } from 'rxjs';

export interface Comment{
  id?: string,
  content: string,
  createdTime?: string,
  updatedTime?: string,
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private db: AngularFireDatabase) {}

  getComments(userId: string): Observable<any>{
    return this.db.list(`comment/${userId}`).valueChanges() as Observable<any>;
  }

  addComment(userId: string, comment: Comment){
    const commentRef = this.db.list(`comments/${userId}`);
    const timestamp = serverTimestamp();
    commentRef.push({...comment, createdTime: timestamp})
  }


}
