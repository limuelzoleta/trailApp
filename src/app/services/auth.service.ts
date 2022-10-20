import { Injectable } from '@angular/core';
import {
	Auth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut
} from '@angular/fire/auth';
import { AngularFireDatabase, } from '@angular/fire/compat/database'

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

	constructor(private auth: Auth, private db: AngularFireDatabase) { }

	async register({ email, password, name }: UserCredential) {
		try {
			const user = await createUserWithEmailAndPassword(this.auth, email, password)
			this.setUserName(user.user.uid, name)
			const userInfo: User = {
				id: user.user.uid,
				email: user.user.email,
				displayName: name
			}

			this.saveUserToStorage(userInfo);


			return user;
		} catch (e) {
			return null;
		}
	}

	async login({ email, password }: UserCredential) {
		try {
			const user = await signInWithEmailAndPassword(this.auth, email, password);

			const userName = await this.getUserName(user.user.uid);
			console.log(userName)
			const userInfo: User = {
				id: user.user.uid,
				email: user.user.email,
				displayName: userName
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

	setUserName(userId: string, displayName: string) {
		const userRef = this.db.list(`userInfo/${userId}`);
		userRef.set('displayName', displayName);
	}

	getUserName(userId: string) {
		return new Promise((resolve, reject) => {
			this.db.object(`userInfo/${userId}`).valueChanges()
				.subscribe((data: any) => {
					resolve(data.displayName);
				})
		})


	}

	clearStorage() {
		localStorage.clear();
	}

}
