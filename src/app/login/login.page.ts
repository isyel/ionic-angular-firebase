import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LOGIN } from '../constants/formValidationMessage';
import { Router } from '@angular/router';
import { HelperService } from '../providers/helper.service';
import { FirebaseAuthService } from '../providers/firebase-auth/firebase-auth.service';
import { WidgetUtilService } from '../providers/widget-util/widget-util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  formError: any = {
    email: "",
    password: ""
  };
  validationMessage: any = LOGIN;
  showloginSpinner: boolean = false;
  showloginWithGoogleSpinner: boolean = false;

  constructor(private helperService: HelperService, private router: Router,
    private firebaseAuthService: FirebaseAuthService, private widgetUtilService: WidgetUtilService) {}

  ngOnInit() {
    this.createFormControl();
    this.createForm();
  }

  resetForm() {
    this.loginForm.reset();
    this.formError = {
      email: "",
      password: ""
    };
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  googleLogin() {
    if(this.helperService.isNativePlatform()) {
      this.googleLoginWeb();
    } else {
      this.nativeGoogleLogin();
    }
  }

  createFormControl() {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    })
    this.loginForm.valueChanges.subscribe(data => this.onFormValuesChanged(data))
  }

  onFormValuesChanged(data) {
    this.formError = this.helperService.prepareValidationMessage(this.loginForm, this.validationMessage, this.formError);
    console.log('===formError: ', this.formError);
  }

  async loginWithEmailPassword() {
    try {
      this.showloginSpinner = true;
      const result = await this.firebaseAuthService.loginWithEmailPassword(this.email.value, this.password.value);
      console.log('login result: ', result);
      this.showloginSpinner = false;
      this.widgetUtilService.presentToast('Login Successful');
      this.resetForm();
      this.router.navigate(['/']);
    } catch (error) {
      console.log('===sign up error: ', error);
      this.showloginSpinner = false;
      this.widgetUtilService.presentToast(error.message);
    }
  }

  async googleLoginWeb() {
    try {
      this.showloginWithGoogleSpinner = true;
      const result = await this.firebaseAuthService.googleLoginWeb();
      console.log('login result: ', result);
      this.showloginWithGoogleSpinner = false;
      this.widgetUtilService.presentToast('Login Successful');
      this.resetForm();
      this.router.navigate(['/']);
    } catch (error) {
      console.log('===sign up error: ', error);
      this.showloginWithGoogleSpinner = false;
      this.widgetUtilService.presentToast(error.message);
    }
  }

  async nativeGoogleLogin() {
    try {
      this.widgetUtilService.presentLoading();
      const result = await this.firebaseAuthService.nativeGoogleLogin();
      console.log('login result: ', result);
      this.widgetUtilService.dismissLoader();
      this.widgetUtilService.presentToast('Login Successful');
      this.resetForm();
      this.router.navigate(['/']);
    } catch (error) {
      console.log('===sign up error: ', error);
      this.widgetUtilService.dismissLoader();
      this.widgetUtilService.presentToast("Something went wrong");
    }
  }

}
