import { Routes } from '@angular/router';
import { ChangePasswordGuard } from '../../core/guards/auth.guard';

export const AUTH_ROUTES: Routes = [
  { path: 'login', loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent) },
  { path: 'accept-invite/:token', loadComponent: () => import('./accept-invite/accept-invite.component').then((m) => m.AcceptInviteComponent) },
  { path: 'reset-password', loadComponent: () => import('./reset-password/reset-password.component').then((m) => m.ResetPasswordComponent) },
  { path: 'reset-password/:token', loadComponent: () => import('./reset-password/confirm-reset.component').then((m) => m.ConfirmResetComponent) },
  {
    path: 'change-password',
    canActivate: [ChangePasswordGuard],
    loadComponent: () => import('./change-password/change-password.component').then((m) => m.ChangePasswordComponent),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
