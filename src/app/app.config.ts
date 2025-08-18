import { ApplicationConfig, EnvironmentProviders, ErrorHandler, InjectionToken, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';

import { routerProviders } from './app.router-provider';
import { WINDOW, windowProvider } from './utils/window';
import { LOCAL_STORAGE, localStorageProvider } from './utils/local-storage';

type ErrorProvider = {
  provide: typeof ErrorHandler;
  useClass: typeof GlobalErrorHandler
}

type WindowProvider = {
  provide: InjectionToken<Window>;
  useFactory: () => (Window & typeof globalThis) | null;
}

type LocalStorageProvider = {
  provide: InjectionToken<Storage>;
  useFactory: () => (Storage) | null
}

class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global Error Captured:', error);
  }
}

export const coreProviders: (EnvironmentProviders | WindowProvider | LocalStorageProvider)[] = [
  provideZoneChangeDetection({ 
    eventCoalescing: true, 
    runCoalescing: true 
  }),
  { 
    provide: WINDOW, 
    useFactory: windowProvider 
  },
  {
    provide: LOCAL_STORAGE,
    useFactory: localStorageProvider
  }
];

export const errorProviders: (EnvironmentProviders | ErrorProvider)[] = [
  provideBrowserGlobalErrorListeners(),
  { provide: ErrorHandler, useClass: GlobalErrorHandler }
];


export const appConfig: ApplicationConfig = {
  providers: [
    routerProviders,
    ...coreProviders,
    ...errorProviders
  ]
};
