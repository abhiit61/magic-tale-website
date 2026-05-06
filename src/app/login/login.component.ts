import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit(): void {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      this.authService.handleAuthCallback(token);
      this.router.navigate(['/storybook-form'], { replaceUrl: true });
      return;
    }
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/storybook-form']);
    }
  }

  signInWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
