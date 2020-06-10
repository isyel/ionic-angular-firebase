import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../providers/firebase-auth/firebase-auth.service';
import { Router } from '@angular/router';
import { WidgetUtilService } from '../providers/widget-util/widget-util.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(private firebaseAuthService: FirebaseAuthService, private router: Router,
    private widgetUtilService: WidgetUtilService) { }

  ngOnInit() {
  }

  async logout() {
    try {
      await this.firebaseAuthService.logout();
      this.widgetUtilService.presentToast('Logged Out');
      this.router.navigate(['/login']);
    } catch (error) {
      console.log('===logout error: ', error);
      this.widgetUtilService.presentToast(error.message);
    }
  }
}
