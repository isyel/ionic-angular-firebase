import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from '../providers/helper.service';
import { SIGNUP } from '../constants/formValidationMessage';
import { FirebaseAuthService } from '../providers/firebase-auth/firebase-auth.service';
import { WidgetUtilService } from '../providers/widget-util/widget-util.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;
  email: FormControl;
  password: FormControl;
  formError: any = {
    email: "",
    password: ""
  };
  validationMessage: any = SIGNUP;
  showSignupSpinner: boolean = false;

  constructor(private helperService: HelperService, private router: Router,
    private firebaseAuthService: FirebaseAuthService, private widgetUtilService: WidgetUtilService) { }

  ngOnInit() {
    this.createFormControl();
    this.createForm();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  resetForm() {
    this.signupForm.reset();
    this.formError = {
      email: "",
      password: ""
    };
  }

  createFormControl() {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  }

  createForm() {
    this.signupForm = new FormGroup({
      email: this.email,
      password: this.password
    })
    this.signupForm.valueChanges.subscribe(data => this.onFormValuesChanged(data))
  }

  onFormValuesChanged(data) {
    this.formError = this.helperService.prepareValidationMessage(this.signupForm, this.validationMessage, this.formError);
    console.log('===formError: ', this.formError);
  }

  async signup() {
    try {
      this.showSignupSpinner = true;
      const result = await this.firebaseAuthService.registerWithEmailPassword(this.email.value, this.password.value);
      console.log('sign up result: ', result);
      this.showSignupSpinner = false;
      this.widgetUtilService.presentToast('Sign up Successful, Check Email for Verification Link');
      this.resetForm();
      this.router.navigate(['/']);
    } catch (error) {
      console.log('===sign up error: ', error);
      this.showSignupSpinner = false;
      this.widgetUtilService.presentToast(error.message);
    }
  }

}
