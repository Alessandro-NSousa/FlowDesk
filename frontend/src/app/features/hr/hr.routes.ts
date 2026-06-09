import { Routes } from '@angular/router';

export const HR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./hr-hub/hr-hub.component').then((m) => m.HrHubComponent),
  },
];