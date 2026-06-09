import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard, FeatureGuard } from './core/guards/auth.guard';
import { HR_FEATURE_SLUGS } from './core/services/feature.service';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'tickets',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/tickets/tickets.routes').then((m) => m.TICKETS_ROUTES),
  },
  {
    path: 'patrimony',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/patrimony/patrimony.routes').then((m) => m.PATRIMONY_ROUTES),
  },
  {
    path: 'hr',
    canActivate: [AuthGuard, FeatureGuard],
    data: { requiredFeatureSlugs: HR_FEATURE_SLUGS },
    loadChildren: () => import('./features/hr/hr.routes').then((m) => m.HR_ROUTES),
  },
  {
    path: 'sectors',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () => import('./features/sectors/sectors.routes').then((m) => m.SECTORS_ROUTES),
  },
  {
    path: 'users',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () => import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
  },
  { path: '**', redirectTo: 'dashboard' },
];
