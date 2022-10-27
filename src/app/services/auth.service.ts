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

	constructor(
		private auth: Auth,
		private userSvc: UserService,
		private prefService: PreferenceService,
	) { }

	async register({ email, password, name }: UserCredential) {
		try {
			const user = await createUserWithEmailAndPassword(this.auth, email, password)
			this.userSvc.addUserInfo({ displayName: name })
			const userInfo: User = {
				id: user.user.uid,
				email: user.user.email,
				displayName: name
			}
			this.userSvc.saveUserToLocalStorage(userInfo);
			await this.prefService.setDefaultPrefs();
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

	async logout() {
		this.userSvc.clearStorage();
		await Preferences.clear();
		return signOut(this.auth);
	}

}
