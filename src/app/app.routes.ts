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
        path: 'tutorial',
        loadComponent: () => import('./pages/tutorial/tutorial'),
        data: {label: 'Tutorial'}
      },
      {
        path: 'playground',
        loadComponent: () => import('./pages/playground/playground'),
        data: {label: 'Playground'}
      }
    ]
  }
];
