import { Injectable } from '@angular/core';
import { docData, Firestore } from '@angular/fire/firestore';
import { doc, setDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USER_INFO_PATH = 'user_info';
  user: any
  constructor(private firestore: Firestore) {
    this.user = this.getUserDataFromLocalStorage();
  }

  getUserInfo(id = this.user.id) {
    const userRef = doc(this.firestore, `${id}/${this.USER_INFO_PATH}`)
    return docData(userRef)
  }

  addUserInfo(userData: any) {
    const userRef = doc(this.firestore, `${this.user.id}/${this.USER_INFO_PATH}`);
    return setDoc(userRef, userData);
  }

  updateUserInfo(userData: any) {
    const userRef = doc(this.firestore, `${this.user.id}/${this.USER_INFO_PATH}`);
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
