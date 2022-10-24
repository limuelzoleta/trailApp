import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collectionData, collectionSnapshots, Firestore, onSnapshot, orderBy, query, serverTimestamp, where } from '@angular/fire/firestore';
import { addDoc, collection, doc, updateDoc } from '@firebase/firestore';

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
    return addDoc(cmtRef, { ...comment, createdTime: serverTimestamp() });
  }

  updateComment(userId: string, commentId: string, comment: any, textEdited: boolean = false) {
    const cmtRef = doc(this.firestore, `${userId}/${this.COMMENTS_COLLECTION}/${commentId}`);
    const createdTime = comment.createdTime ? comment.createdTime : serverTimestamp()
    updateDoc(cmtRef, { ...comment, createdTime, textEdited, updatedTime: serverTimestamp() });
  }

}
