import { Routes } from '@angular/router';
import { StorybookFormComponent } from './storybook-form/storybook-form.component';
import { LoginComponent } from './login/login.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { UsersComponent } from './users/users.component';
import { StoriesListComponent } from './stories-list/stories-list.component';
import { SettingsComponent } from './settings/settings.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: AuthCallbackComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'storybook-form', component: StorybookFormComponent, canActivate: [authGuard] },
  { path: 'my-stories', component: StoriesListComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: 'login' }
];
