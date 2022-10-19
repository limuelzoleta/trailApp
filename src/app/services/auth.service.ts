import { Injectable } from '@angular/core';
import {
	Auth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut
} from '@angular/fire/auth';
import { CommentService } from './comment.service';

type UserCredential = {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private auth: Auth) { }

  async register({ email, password }: UserCredential) {
		try {
			const user = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log(user)
			return user;
		} catch (e) {
			return null;
		}
	}

	async login({ email, password }: UserCredential) {
		try {
			const user = await signInWithEmailAndPassword(this.auth, email, password);
      console.log(user)
      // const comment = {
      //   content: 'this is a test comment'
      // }
      // this.cmtSvc.addComment(user.user.uid, comment);

			return user;
		} catch (e) {
			return null;
		}
	}

	logout() {
		return signOut(this.auth);
	}
}
