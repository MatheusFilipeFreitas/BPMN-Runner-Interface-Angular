import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';

import { routerProviders } from './app.router-provider';
import { WINDOW, windowProvider } from './utils/window';

export const appConfig: ApplicationConfig = {
  providers: [
    routerProviders,
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    {
      provide: WINDOW,
      useFactory: windowProvider
    }
  ]
};
