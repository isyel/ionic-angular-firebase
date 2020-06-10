import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth/';
import { auth } from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { HelperService } from '../helper.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor(private angularFireAuth: AngularFireAuth, private googlePlus: GooglePlus,
    private helperService: HelperService) { }

  async registerWithEmailPassword(email, password) {
    try {
      const result = await this.angularFireAuth.createUserWithEmailAndPassword(email, password);
      (await this.angularFireAuth.currentUser).sendEmailVerification();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async loginWithEmailPassword(email, password) {
    try {
      const result = await this.angularFireAuth.signInWithEmailAndPassword(email, password);
      (await this.angularFireAuth.currentUser).sendEmailVerification();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async googleLoginWeb() {
    try {
      return await this.angularFireAuth.signInWithRedirect(new auth.GoogleAuthProvider());
    } catch (error) {
      throw new Error(error);
    }
  }

  async nativeGoogleLogin() {
    try {
      const result = await this.googlePlus.login({
        webClientId: '516671028824-tncne695ep184abfpigmott2pdt5o16j.apps.googleusercontent.com',
        offline: true,
        scope: 'profile email'
      });
      await this.angularFireAuth.signInAndRetrieveDataWithCredential(auth.GoogleAuthProvider.credential(result.idToken));
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  getAuthState() {
    return this.angularFireAuth.authState;
  }

  async logout() {
    try {
      await this.angularFireAuth.signOut();
      if(this.helperService.isNativePlatform()) {
        this.nativeGoogleLogout();
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async nativeGoogleLogout() {
    try {
      await this.googlePlus.logout();
    } catch (error) {
      throw new Error(error);
    }
  }

  async checkIfEmailVerified() {
    try {
      //await this.angularFireAuth.checkActionCode();
    } catch (error) {
      throw new Error(error);
    }
  }
}
