import { Routes } from '@angular/router';
import MainComponent from './main';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./components/home/home'),
        data: {label: 'Home'},
      },
    ]
  }
];
