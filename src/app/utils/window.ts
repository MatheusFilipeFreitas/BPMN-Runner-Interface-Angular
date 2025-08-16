import { DOCUMENT, inject, InjectionToken } from "@angular/core";

export const WINDOW = new InjectionToken<Window>('WINDOW');

export function windowProvider() {
  return inject(DOCUMENT).defaultView;
}