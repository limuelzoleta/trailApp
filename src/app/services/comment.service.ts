import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { addDoc, collection, doc, updateDoc, Timestamp } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private COMMENTS_COLLECTION = 'comments/comment';
  constructor(private firestore: Firestore, private afs: AngularFirestore) { }

  getComments(userId: string) {
    const cmtRef = collection(this.firestore, `${userId}/${this.COMMENTS_COLLECTION}`)
    const qRef = query(cmtRef, orderBy('createdTime', 'asc'));
    return collectionData(qRef, { idField: 'id' });
  }

  addComment(userId: string, comment: any) {
    const cmtRef = collection(this.firestore, `${userId}/${this.COMMENTS_COLLECTION}`)
    return addDoc(cmtRef, { ...comment, createdTime: Timestamp.fromDate(new Date()) });
  }

  updateComment(userId: string, commentId: string, comment: any, textEdited: boolean = false) {
    const cmtRef = doc(this.firestore, `${userId}/${this.COMMENTS_COLLECTION}/${commentId}`);
    console.log(comment.createdTime ? 'has created time' : 'have not');
    updateDoc(cmtRef, { ...comment, textEdited, updatedTime: Timestamp.fromDate(new Date()) });
  }

}
