import { Routes } from '@angular/router';

export const PATRIMONY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./patrimony-list/patrimony-list.component').then((m) => m.PatrimonyListComponent),
  },
];
