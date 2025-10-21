import {DOCUMENT} from '@angular/common';
import {Injectable, inject, signal} from '@angular/core';
import {Subject} from 'rxjs';
import { LOCAL_STORAGE } from '../utils/local-storage';

export const THEME_PREFERENCE_LOCAL_STORAGE_KEY = 'themePreference';
export const DARK_MODE_CLASS_NAME = 'docs-dark-mode';
export const LIGHT_MODE_CLASS_NAME = 'docs-light-mode';
export const PREFERS_COLOR_SCHEME_DARK = '(prefers-color-scheme: dark)';

export type Theme = 'dark' | 'light' | 'auto';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly localStorage = inject(LOCAL_STORAGE);

  readonly theme = signal<Theme | null>(this.getThemeFromLocalStorageValue());
  readonly themeChanged$ = new Subject<void>();

  constructor() {
    this.loadThemePreference();
    this.watchPreferredColorScheme();
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.setThemeInLocalStorage();
    this.setThemeBodyClasses(theme === 'auto' ? preferredScheme() : theme);
  }

  private loadThemePreference(): void {
    const savedUserPreference = this.getThemeFromLocalStorageValue();
    const useTheme = savedUserPreference ?? 'auto';

    this.theme.set(useTheme);
    this.setThemeBodyClasses(useTheme === 'auto' ? preferredScheme() : useTheme);
  }

  private setThemeBodyClasses(theme: 'dark' | 'light'): void {
    const documentClassList = this.document.documentElement.classList;
    if (theme === 'dark') {
      documentClassList.add(DARK_MODE_CLASS_NAME);
      documentClassList.remove(LIGHT_MODE_CLASS_NAME);
    } else {
      documentClassList.add(LIGHT_MODE_CLASS_NAME);
      documentClassList.remove(DARK_MODE_CLASS_NAME);
    }
    this.themeChanged$.next();
  }

  private getThemeFromLocalStorageValue(): Theme | null {
    const theme = this.localStorage?.getItem(THEME_PREFERENCE_LOCAL_STORAGE_KEY) as Theme | null;
    return theme ?? null;
  }

  private setThemeInLocalStorage(): void {
    if (this.theme()) {
      this.localStorage?.setItem(THEME_PREFERENCE_LOCAL_STORAGE_KEY, this.theme()!);
    }
  }

  private watchPreferredColorScheme(): void {
    window.matchMedia(PREFERS_COLOR_SCHEME_DARK).addEventListener('change', (event) => {
      const preferredScheme = event.matches ? 'dark' : 'light';
      this.setThemeBodyClasses(preferredScheme);
    });
  }
}

function preferredScheme(): 'dark' | 'light' {
  return window.matchMedia(PREFERS_COLOR_SCHEME_DARK).matches ? 'dark' : 'light';
}
