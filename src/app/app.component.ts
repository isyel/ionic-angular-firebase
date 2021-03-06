import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseAuthService } from './providers/firebase-auth/firebase-auth.service';
import { Router } from '@angular/router';
import { WidgetUtilService } from './providers/widget-util/widget-util.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  isLoggedIn: boolean = false;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private firebaseAuthService: FirebaseAuthService,
    private router: Router, private widgetUtilService: WidgetUtilService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#3880ff');
      this.splashScreen.hide();
    });
    this.getAuthState();
  }

  getAuthState() {
    this.widgetUtilService.presentLoading();
    this.firebaseAuthService.getAuthState().subscribe((user) => {
      console.log('user auth state: ', user ? user.toJSON() : null);
      if(user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
      this.handleNavigation();
      this.widgetUtilService.dismissLoader();
    }, error => {
      this.widgetUtilService.presentToast(error.message);
      this.widgetUtilService.dismissLoader();
    })
  }

  handleNavigation() { 
    if(this.isLoggedIn) {
      console.log("route = ", this.router.url.split('/')[1]);
      const currentURL = this.router.url.split('/')[1];
      if(currentURL === 'login' || currentURL === 'signup') {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
