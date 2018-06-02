"use strict";

import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../_services/auth.service";

@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public user;
  public loginLoading: boolean;
  public loginError: boolean;

  @ViewChild('loginForm')
  private loginForm: NgForm;
  @ViewChild('loginFormElement')
  private loginFormElement: ElementRef;

  constructor(private router: Router, private authService: AuthService) {
    this.user = {};
  }

  ngOnInit() {
  }

  loginClick() {
    if(this.loginForm.valid) {
      this.loginLoading = true;
      this.authService.login(this.user.email, this.user.password)
        .subscribe(user => {
          this.loginLoading = false;
          this.router.navigate(['/dashboard'])
        }, error => {
          this.loginLoading = false;
          this.loginError = true;
          this.shakeForm(this.loginFormElement);
        });
    } else {
      this.shakeForm(this.loginFormElement);
    }
  }

  shakeForm(formElement) {
    formElement.nativeElement.classList.add('shake');
    setTimeout(() => formElement.nativeElement.classList.remove('shake'), 800);
  }

  isFieldManipulated(form, field) {
    return field.dirty || field.touched || form.submitted;
  }

  fieldHasErrors(field, errorType?) {
    return errorType ? field.errors && field.errors[errorType] : field.errors;
  }
}
