import { Injectable } from '@angular/core';
import { collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { addDoc, collection, doc, updateDoc, Timestamp } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { COMMENTS_COLLECTION } from '../utils/constants';
import { Comment, User } from '../utils/definitions';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  user: User;
  constructor(private firestore: Firestore, private userSvc: UserService) {
    this.user = this.userSvc.getUserDataFromLocalStorage();
  }

  getComments(): Observable<Comment[]> {
    const cmtRef = collection(this.firestore, `${this.user.id}/${COMMENTS_COLLECTION}`)
    const qRef = query(cmtRef, orderBy('createdTime', 'asc'));
    return collectionData(qRef, { idField: 'id' }) as Observable<Comment[]>;
  }

  addComment(comment: Comment) {
    const cmtRef = collection(this.firestore, `${this.user.id}/${COMMENTS_COLLECTION}`)
    return addDoc(cmtRef, { ...comment, createdTime: Timestamp.fromDate(new Date()) });
  }

  updateComment(commentId: string, comment: any, textEdited: boolean = false) {
    const cmtRef = doc(this.firestore, `${this.user.id}/${COMMENTS_COLLECTION}/${commentId}`);
    updateDoc(cmtRef, { ...comment, textEdited, updatedTime: Timestamp.fromDate(new Date()) });
  }

}
