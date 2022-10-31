import { Injectable } from '@angular/core';
import {
	Auth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut
} from '@angular/fire/auth';
import { Preferences } from '@capacitor/preferences';
import { PreferenceService } from './preference.service';
import { UserService } from './user.service';

export interface UserCredential {
	email: string,
	password: string,
	name: string
}

export interface User {
	id: string,
	email?: string | null,
	displayName?: string | null | unknown
}

@Injectable({
	providedIn: 'root'
})

export class AuthService {

	constructor(private auth: Auth) { }

	async register({ email, password }: UserCredential) {
		try {
			const user = await createUserWithEmailAndPassword(this.auth, email, password)
			return user;
		} catch (e) {
			return null;
		}
	}

	async login({ email, password }: UserCredential) {
		try {
			const user = await signInWithEmailAndPassword(this.auth, email, password);
			return user;
		} catch (e) {
			return null;
		}
	}

	async getCurrentUser() {
		return this.auth.currentUser;
	}

	async logout() {
		localStorage.clear()
		await Preferences.clear();
		return signOut(this.auth);
	}



}
