import { Injectable } from '@angular/core';
import {
	Auth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut
} from '@angular/fire/auth';
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

	constructor(private auth: Auth, private userSvc: UserService) { }

	async register({ email, password, name }: UserCredential) {
		try {
			const user = await createUserWithEmailAndPassword(this.auth, email, password)
			this.userSvc.addUserInfo(user.user.uid, { displayName: name })

			const userInfo: User = {
				id: user.user.uid,
				email: user.user.email,
				displayName: name
			}

			this.userSvc.saveUserToLocalStorage(userInfo);
			return user;
		} catch (e) {
			return null;
		}
	}

	async login({ email, password }: UserCredential) {
		try {
			const user = await signInWithEmailAndPassword(this.auth, email, password);

			const userData = await this.userSvc.getUserInfo(user.user.uid).toPromise();
			console.log(userData)
			const userInfo: User = {
				id: user.user.uid,
				email: user.user.email,
				displayName: userData.displayName
			}
			this.userSvc.saveUserToLocalStorage(userInfo);
			return user;

		} catch (e) {
			return null;
		}
	}

	logout() {
		this.userSvc.clearStorage();
		return signOut(this.auth);
	}

}
