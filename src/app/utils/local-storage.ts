import { InjectionToken } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage | null>('LOCAL_STORAGE');

export function localStorageProvider(): Storage {
  return window.localStorage;
}
