import { Injectable, signal, PLATFORM_ID, inject, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  darkMode = signal(this.getInitialTheme());

  constructor() {
    // Aplicar tema automáticamente cuando cambia
    effect(() => {
      if (this.isBrowser) {
        this.applyTheme(this.darkMode());
      }
    });
  }

  private getInitialTheme(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleTheme(): void {
    if (!this.isBrowser) return;

    this.darkMode.update(value => {
      const newValue = !value;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  }

  private applyTheme(isDark: boolean): void {
    if (!this.isBrowser) return;

    const html = document.documentElement;

    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  initTheme(): void {
    if (!this.isBrowser) return;
    this.applyTheme(this.darkMode());
  }
}
