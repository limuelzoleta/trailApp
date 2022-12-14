import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonMenu } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  user: any;
  @Input() pageTitle: string;
  @Input() showBackButton: boolean;
  @ViewChild(IonMenu) menu: IonMenu;

  constructor(
    private userSvc: UserService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const user = this.userSvc.getUserDataFromLocalStorage();
    if (Object.keys(user).length > 0) {
      this.user = user;
    }
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      })
  }

  navigateToSettings() {
    this.router.navigateByUrl('/home/settings')
    this.menu.toggle();
  }

}
