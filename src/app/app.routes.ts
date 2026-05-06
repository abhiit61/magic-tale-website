import { Routes } from '@angular/router';
import { StorybookFormComponent } from './storybook-form/storybook-form.component';
import { LoginComponent } from './login/login.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: AuthCallbackComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'storybook-form', component: StorybookFormComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
