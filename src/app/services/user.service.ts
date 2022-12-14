import { Injectable } from '@angular/core';
import { docData, Firestore } from '@angular/fire/firestore';
import { doc, setDoc } from '@firebase/firestore';
import { USER_INFO_PATH } from '../utils/constants';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: any
  constructor(
    private firestore: Firestore,
    private auth: AuthService,
  ) {
    this.user = this.getUserDataFromLocalStorage();
    if (Object.keys(this.user).length == 0) {
      this.getCurrentUser();
    }
  }

  getUserInfo(id = this.user.id) {
    const userRef = doc(this.firestore, `${id}/${USER_INFO_PATH}`)
    return docData(userRef)
  }

  addUserInfo(userData: any, user: any = this.user): Promise<void> {
    this.user = user
    const userRef = doc(this.firestore, `${user.id}/${USER_INFO_PATH}`);
    return setDoc(userRef, userData);
  }

  updateUserInfo(userData: any) {
    const userRef = doc(this.firestore, `${this.user.id}/${USER_INFO_PATH}`);
    return setDoc(userRef, userData);
  }

  saveUserToLocalStorage(userData: any) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  getUserDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem('userData') || '{}');
  }

  async getCurrentUser() {
    this.user = await this.auth.getCurrentUser();
  }

}
