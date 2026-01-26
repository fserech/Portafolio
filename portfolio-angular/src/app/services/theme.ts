import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  darkMode = signal<boolean>(false);

  constructor() {
    console.log('ThemeService initialized, isBrowser:', this.isBrowser);

    if (this.isBrowser) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('theme');

      console.log('Saved theme:', savedTheme, 'Prefers dark:', prefersDark);

      const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      this.darkMode.set(shouldBeDark);

      effect(() => {
        const isDark = this.darkMode();
        console.log('Theme effect running, isDark:', isDark);

        if (isDark) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      });
    }
  }

  toggleTheme() {
    if (this.isBrowser) {
      console.log('toggleTheme called, current value:', this.darkMode());
      this.darkMode.update(value => !value);
      console.log('toggleTheme after update:', this.darkMode());
    }
  }
}
