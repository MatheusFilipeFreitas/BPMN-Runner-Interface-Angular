import { ApplicationConfig, EnvironmentProviders, ErrorHandler, InjectionToken, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';

import { routerProviders } from './app.router-provider';
import { WINDOW, windowProvider } from './utils/window';

type ErrorProvider = {
  provide: typeof ErrorHandler;
  useClass: typeof GlobalErrorHandler
}

type WindowProvider = {
  provide: InjectionToken<Window>;
  useFactory: () => (Window & typeof globalThis) | null;
}

class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global Error Captured:', error);
  }
}

export const coreProviders: (EnvironmentProviders | WindowProvider)[] = [
  provideZoneChangeDetection({ 
    eventCoalescing: true, 
    runCoalescing: true 
  }),
  { 
    provide: WINDOW, 
    useFactory: windowProvider 
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
