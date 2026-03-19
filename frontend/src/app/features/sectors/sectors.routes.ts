import { Routes } from '@angular/router';

export const SECTORS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./sector-list/sector-list.component').then((m) => m.SectorListComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./sector-detail/sector-detail.component').then((m) => m.SectorDetailComponent),
  },
];
