import { Injectable } from '@angular/core';
import { docData, Firestore } from '@angular/fire/firestore';
import { doc, setDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USER_INFO_PATH = 'user_info';
  constructor(private firestore: Firestore) { }

  getUserInfo(userId: string) {
    const userRef = doc(this.firestore, `${userId}/${this.USER_INFO_PATH}`)
    return docData(userRef);
  }

  addUserInfo(userId: string, userData: any) {
    const userRef = doc(this.firestore, `${userId}/${this.USER_INFO_PATH}`);
    return setDoc(userRef, userData);
  }

  updateUserInfo(userId: string, userData: any) {
    const userRef = doc(this.firestore, `${userId}/${this.USER_INFO_PATH}`);
    return setDoc(userRef, userData);
  }

  saveUserToLocalStorage(userData: any) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  getUserDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem('userData') || '{}');
  }

  clearStorage() {
    localStorage.clear()
  }


}
