import { Component } from '@angular/core';
import { FirebaseAuthService } from '../providers/firebase-auth/firebase-auth.service';
import { WidgetUtilService } from '../providers/widget-util/widget-util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  profileInfo: any = [];
  profileAvailable: boolean = false;

  constructor(private firebaseAuthService: FirebaseAuthService, 
    private widgetUtilService: WidgetUtilService) {
    this.getUserProfile();
  }

  getUserProfile() {
    this.profileAvailable = false;
    this.firebaseAuthService.getAuthState().subscribe((user) => {
      if(user) {
        this.profileInfo = user.toJSON();
      }
      console.log(this.profileInfo);
      this.profileAvailable = true;
    }, error => {
      this.widgetUtilService.presentToast(error.message);
      this.profileAvailable = true;
    });
  }

  async logout() {
    try {
      await this.firebaseAuthService.logout();
      this.widgetUtilService.presentToast('Logged Out');
    } catch (error) {
      console.log('===logout error: ', error);
      this.widgetUtilService.presentToast(error.message);
    }
  }

}
