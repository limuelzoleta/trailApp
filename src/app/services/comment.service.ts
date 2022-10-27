import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { addDoc, collection, doc, updateDoc, Timestamp } from '@firebase/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private COMMENTS_COLLECTION = 'comments/comment';
  user: any;
  constructor(private firestore: Firestore, private userSvc: UserService) {
    this.user = this.userSvc.getUserDataFromLocalStorage();
  }

  getComments() {
    const cmtRef = collection(this.firestore, `${this.user.id}/${this.COMMENTS_COLLECTION}`)
    const qRef = query(cmtRef, orderBy('createdTime', 'asc'));
    return collectionData(qRef, { idField: 'id' });
  }

  addComment(comment: any) {
    const cmtRef = collection(this.firestore, `${this.user.id}/${this.COMMENTS_COLLECTION}`)
    return addDoc(cmtRef, { ...comment, createdTime: Timestamp.fromDate(new Date()) });
  }

  updateComment(commentId: string, comment: any, textEdited: boolean = false) {
    const cmtRef = doc(this.firestore, `${this.user.id}/${this.COMMENTS_COLLECTION}/${commentId}`);
    updateDoc(cmtRef, { ...comment, textEdited, updatedTime: Timestamp.fromDate(new Date()) });
  }

}
