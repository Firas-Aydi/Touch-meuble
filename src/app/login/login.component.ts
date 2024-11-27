import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  passwordFieldType: string = 'password';
  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  getEmail() {
    return this.loginForm.get('email');
  }
  getPassword() {
    return this.loginForm.get('password');
  }
  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage =
        'Veuillez remplir tous les champs requis correctement.';
      return;
    }
    const { email, password } = this.loginForm.value;
    this.authservice
      .login(email, password)
      .then((user) => {
        // Clear form after successful login
        this.route.navigate(['/home']);
        if (user && user.user) {
          localStorage.setItem('userConnect', user.user.uid);
        }
        this.loginForm.reset();
        this.errorMessage = '';
        console.log('Login successful', user);
      })
      .catch((error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Incorrect email ou password';
      });
  }

  sighInGoogle() {
    this.authservice.googleSignIn();
  }
}
