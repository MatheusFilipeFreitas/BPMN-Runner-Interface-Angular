import { ApplicationConfig, EnvironmentProviders, ErrorHandler, importProvidersFrom, InjectionToken, provideBrowserGlobalErrorListeners, Provider, provideZoneChangeDetection } from '@angular/core';

import { routerProviders } from './app.router-provider';
import { WINDOW, windowProvider } from './utils/window';
import { LOCAL_STORAGE, localStorageProvider } from './utils/local-storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environments';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

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

export const firestoreProviders: (EnvironmentProviders)[] = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => getAuth())
];

export const primengProviders: (EnvironmentProviders)[] = [
  provideAnimationsAsync(),
  providePrimeNG({
    theme: {
      preset: Aura
    }
  })
];

export const httpClientProviders: (EnvironmentProviders)[] = [
  provideHttpClient()
];

export const appConfig: ApplicationConfig = {
  providers: [
    routerProviders,
    ...coreProviders,
    ...errorProviders,
    ...httpClientProviders,
    ...firestoreProviders,
    ...primengProviders,
  ]
};
