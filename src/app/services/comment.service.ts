import { Injectable, Query } from '@angular/core';
import { collectionData, Firestore, orderBy, query, serverTimestamp, where } from '@angular/fire/firestore';
import { addDoc, collection, doc, updateDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private COMMENTS_COLLECTION = 'comments/comment';
  constructor(private firestore: Firestore) { }

  getComments(userId: string) {
    const cmtRef = collection(this.firestore, `${userId}/${this.COMMENTS_COLLECTION}`)
    const q = query(cmtRef, orderBy('createdTime', 'asc'));
    return collectionData(q, { idField: 'id' });
  }

  addComment(userId: string, comment: any) {
    const cmtRef = collection(this.firestore, `${userId}/${this.COMMENTS_COLLECTION}`)
    return addDoc(cmtRef, { ...comment, createdTime: serverTimestamp() });
  }

  updateComment(userId: string, commentId: string, comment: any) {
    const cmtRef = doc(this.firestore, `${userId}/${this.COMMENTS_COLLECTION}/${commentId}`);
    updateDoc(cmtRef, { ...comment, updatedTime: serverTimestamp() });
  }

}
