import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthService, User } from 'src/app/services/auth.service';
import { PreferenceService } from 'src/app/services/preference.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	credentials: FormGroup;
	userRegistration: FormGroup;
	showRegister: boolean = false;

	constructor(
		private fb: FormBuilder,
		private loadingController: LoadingController,
		private alertController: AlertController,
		private authService: AuthService,
		private userService: UserService,
		private prefService: PreferenceService,
		private router: Router
	) {

	}

	ngOnInit(): void {
		this.credentials = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});

		this.userRegistration = this.fb.group({
			name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		})
	}

	get email() {
		return this.credentials.get('email');
	}

	get password() {
		return this.credentials.get('password');
	}

	get regEmail() {
		return this.userRegistration.get('email');
	}

	get regPassword() {
		return this.userRegistration.get('password');
	}
	get name() {
		return this.userRegistration.get('name');
	}

	async login() {
		const loading = await this.loadingController.create();
		await loading.present();
		const user = await this.authService.login(this.credentials.value);
		await loading.dismiss();

		if (user) {
			await this.initializeUser(user);
			this.router.navigateByUrl('/home', { replaceUrl: true });

		} else {
			this.showAlert('Login failed', 'Please try again!');
		}
	}


	async register() {
		const loading = await this.loadingController.create();
		await loading.present();

		const user = await this.authService.register(this.userRegistration.value);
		await loading.dismiss();
		if (user) {
			await this.initializeNewUser(user, this.userRegistration.value.name);
			this.router.navigateByUrl('/home', { replaceUrl: true });
		} else {
			this.showAlert('Registration failed', 'Please try again!');
		}
	}

	async initializeUser(user: any): Promise<void> {
		return new Promise((resolve) => {
			const userInfo: User = {
				id: user.user.uid,
				email: user.user.email
			}
			this.userService.getUserInfo(userInfo.id).pipe(take(1)).subscribe(async (data) => {
				userInfo.displayName = data.displayName;
				this.userService.saveUserToLocalStorage(userInfo);
				await this.prefService.setUserPrefs(userInfo.id)
				resolve();
			});
		})
	}

	async initializeNewUser(user: any, name: string): Promise<void> {
		return new Promise(async (resolve) => {
			const userInfo: User = {
				id: user.user.uid,
				email: user.user.email,
				displayName: name,
			}
			this.userService.saveUserToLocalStorage(userInfo);
			await this.userService.addUserInfo({ displayName: name }, userInfo)
			await this.prefService.setDefaultPrefs(userInfo.id)
			resolve();
		})
	}

	createUser() {
		this.showRegister = true;
	}

	async showAlert(header: string, message: string) {
		const alert = await this.alertController.create({
			header,
			message,
			buttons: ['OK']
		});
		await alert.present();
	}

	cancelRegister() {
		this.userRegistration.reset();
		this.showRegister = false;
	}


}
