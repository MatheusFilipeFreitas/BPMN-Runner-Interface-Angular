import { Route, Routes } from '@angular/router';
import MainComponent from './main';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home'),
        data: {label: 'Home'},
      },
      {
        path: 'docs',
        loadComponent: () => import('./pages/docs/doc'),
        data: {label: 'Docs'}
      },
      {
        path: 'playground',
        loadComponent: () => import('./pages/playground/playground'),
        data: {label: 'Playground'}
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ]
  }
];
