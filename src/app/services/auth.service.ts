import { Injectable } from '@angular/core';
import {
	Auth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut
} from '@angular/fire/auth';
import { CommentService } from './comment.service';

export interface UserCredential {
	email: string,
	password: string
}

export interface User {
	id: string,
	email?: string | null,
	displayName?: string | null,
	avatarUrl?: string | null
}

@Injectable({
	providedIn: 'root'
})

export class AuthService {

	constructor(private auth: Auth) { }

	async register({ email, password }: UserCredential) {
		try {
			const user = await createUserWithEmailAndPassword(this.auth, email, password);
			return user;
		} catch (e) {
			return null;
		}
	}

	async login({ email, password }: UserCredential) {
		try {
			const user = await signInWithEmailAndPassword(this.auth, email, password);
			const userInfo: User = {
				id: user.user.uid,
				email: user.user.email,
				displayName: user.user.displayName,
				avatarUrl: user.user.photoURL
			}
			this.saveUserToStorage(userInfo);
			return user;
		} catch (e) {
			return null;
		}
	}

	logout() {
		this.clearStorage();
		return signOut(this.auth);
	}

	saveUserToStorage(user: User) {
		localStorage.setItem('userData', JSON.stringify(user))
	}

	getUserData() {
		const userData = localStorage.getItem('userData');
		if (!userData) {
			return null;
		}
		return JSON.parse(userData);
	}

	clearStorage() {
		localStorage.clear();
	}

}
